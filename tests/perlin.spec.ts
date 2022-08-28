import { Perlin } from '../src/perlin'
import { comparePerm } from './helper'

describe('Perlin', () => {
  describe("noise", () => {
    it("should defilnes noise()", () => {
      const perlin = new Perlin(1)

      expect(typeof perlin.noise).toBe('function')
    })

    it("should return 0 for integers", () => {
      const perlin = new Perlin()
      for (let i = 0; i < 256; i++) {
        expect(perlin.noise(i) ** 2).toBe(0)
      }
    })

    it("should return value includes in -1 and 1", () => {
      const perlin = new Perlin()
      for (let i = 0; i < 100; i++) {
        const result = perlin.noise(0.35) ** 2
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(1)
      }
    })
  })

  describe("fbm", () => {
    it('should define fbm()', () => {
      const perlin = new Perlin(1)

      expect(typeof perlin.fbm).toBe('function')
    })

    it("should return 0 for integers", () => {
      const perlin = new Perlin()
      for (let i = 0; i < 100; i++) {
        const result = perlin.fbm(1, i) **2
        expect(result).toBe(0)
      }
    })

    it("should return value include in -1 and 1", () => {
      const perlin = new Perlin()
      for (let i = 0; i < 100; i++) {
        const result = perlin.fbm(1, 1.5) ** 2
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(1)
      }
    })
  })

  describe("setSeed", () => {
    it('should define setSeed()', () => {
      const perlin = new Perlin()

      expect(typeof perlin.setSeed).toBe('function')
    })

    it('should return the same random array', () => {
      const perlin = new Perlin()
      const perlin2 = new Perlin()
      const seed = Math.random() * 0xff
      perlin.setSeed(seed)
      perlin2.setSeed(seed)
      expect(comparePerm(perlin._perm, perlin2._perm)).toEqual(true)
    })
  })
})
