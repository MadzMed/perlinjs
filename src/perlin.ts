export class Perlin {
  _x: number;
  _freqX: number;
  _y: number;
  _freqY: number;
  _z: number;
  _freqZ: number;
  _perm: number[] = [];
  _seed: number;

  constructor(x?: number, y?: number, z?: number) {
    this._x = x || 0;
    this._y = y || 0;
    this._z = z || 0;
    this._freqX = x || 0;
    this._freqY = y || 0;
    this._freqZ = z || 0;
    this._seed = Math.random() * 0xff;
    this.generatePerm();
  }

  setSeed(seed: number) {
    this._seed = seed;
    this.generatePerm();
  }

  noise(x: number = this._x, y: number = this._y, z: number = this._z): number {
    if (this._y !== 0 && this._z !== 0) return this.Noise3D(x, y, z);
    if (this._y !== 0) return this.Noise2D(x, y);
    return this.Noise(x);
  }

  fbm(
    octaves: number,
    x: number = this._x,
    y: number = this._y,
    z: number = this._z,
    persistence: number = 2.0,
    lacunarity: number = 0.5,
  ): number {
    if (x !== 0 && y !== 0 && z !== 0) return this.Fbm3D(octaves, x, y, z, persistence, lacunarity);
    if (x !== 0 && y !== 0) return this.Fbm2D(octaves, x, y, persistence, lacunarity);
    return this.Fbm(octaves, x, persistence, lacunarity);
  }

  private Noise(x: number = this._x): number {
    const X = Math.floor(x) & 0xff;
    x -= Math.floor(x);
    const u = this.Fade(x);
    return this.Lerp(this.Grad(this._perm[X], x), this.Grad(this._perm[X + 1], x - 1), u) * 2;
  }

  private Noise2D(x: number = this._x, y: number = this._y): number {
    const X = Math.floor(x) & 0xff;
    const Y = Math.floor(y) & 0xff;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = this.Fade(x);
    const v = this.Fade(y);
    const A = (this._perm[X] + Y) & 0xff;
    const B = (this._perm[X + 1] + Y) & 0xff;
    return this.Lerp(
      this.Lerp(this.Grad(this._perm[A], x, y), this.Grad(this._perm[B], x - 1, y), u),
      this.Lerp(this.Grad(this._perm[A + 1], x, y - 1), this.Grad(this._perm[B + 1], x - 1, y - 1), u),
      v,
    );
  }

  private Noise3D(x: number = this._x, y: number = this._y, z: number = this._z): number {
    const X = Math.floor(x) & 0xff;
    const Y = Math.floor(y) & 0xff;
    const Z = Math.floor(z) & 0xff;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = this.Fade(x);
    const v = this.Fade(y);
    const w = this.Fade(z);
    const A = (this._perm[X] + Y) & 0xff;
    const B = (this._perm[X + 1] + Y) & 0xff;
    const AA = (this._perm[A] + Z) & 0xff;
    const AB = (this._perm[A + 1] + Z) & 0xff;
    const BA = (this._perm[B] + Z) & 0xff;
    const BB = (this._perm[B + 1] + Z) & 0xff;
    return this.Lerp(
      this.Lerp(
        this.Lerp(this.Grad(this._perm[AA], x, y, z), this.Grad(this._perm[BA], x - 1, y, z), u),
        this.Lerp(this.Grad(this._perm[AB], x, y - 1, z), this.Grad(this._perm[BB], x - 1, y - 1, z), u),
        v,
      ),
      this.Lerp(
        this.Lerp(this.Grad(this._perm[AA + 1], x, y, z - 1), this.Grad(this._perm[BA + 1], x - 1, y, z - 1), u),
        this.Lerp(
          this.Grad(this._perm[AB + 1], x, y - 1, z - 1),
          this.Grad(this._perm[BB + 1], x - 1, y - 1, z - 1),
          u,
        ),
        v,
      ),
      w,
    );
  }

  private Fbm(octaves: number, x: number, persistence: number = 2.0, lacunarity: number = 0.5): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let max = 0;
    for (let i = 0; i < octaves; i++) {
      this._freqX = x * frequency;
      total += this.Noise(this._freqX) * amplitude;
      max += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    return total / max;
  }

  private Fbm2D(octaves: number, x: number, y: number, persistence: number = 2.0, lacunarity: number = 0.5): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let max = 0;
    for (let i = 0; i < octaves; i++) {
      this._freqX = x * frequency;
      this._freqY = y * frequency;
      total += this.Noise2D(this._freqX, this._freqY) * amplitude;
      max += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    return total / max;
  }

  private Fbm3D(
    octaves: number,
    x: number,
    y: number,
    z: number,
    persistence: number = 2.0,
    lacunarity: number = 0.5,
  ): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let max = 0;
    for (let i = 0; i < octaves; i++) {
      this._freqX = x * frequency;
      this._freqY = y * frequency;
      this._freqZ = z * frequency;
      total += this.Noise3D(this._freqX, this._freqY, this._freqZ) * amplitude;
      max += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    return total / max;
  }

  private Lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private Fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private Grad(hash: number, x: number, y: number = 0, z: number = 0): number {
    if (z !== 0 && y !== 0) {
      const h = hash & 15;
      const u = h < 8 ? x : y;
      const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    if (y !== 0) return ((hash & 1) === 0 ? x : -x) + ((hash & 2) === 0 ? y : -y);

    return (hash & 1) === 0 ? x : -x;
  }

  private generatePerm(): void {
    const random = this.randomSeed();
    for (let i = 0; i < 256; i++) {
      this._perm[i] = i;
    }

    for (let i = 0; i < 256; i++) {
      const r = Math.floor(random() * 256);
      const tmp = this._perm[i];
      this._perm[i] = this._perm[r];
      this._perm[r] = tmp;
    }
  }

  private randomSeed(): () => number {
    const mask = 0xffffffff;
    let mW = (312445667 + this._seed) & mask;
    let mZ = (654773356 - this._seed) & mask;

    return () => {
      mZ = (36969 * (mZ & 65535) + (mZ >>> 16)) & mask;
      mW = (18000 * (mW & 65535) + (mW >>> 16)) & mask;

      let result = ((mZ << 16) + (mW & 65535)) >>> 0;
      result /= 4294967296;
      return result;
    };
  }
}
