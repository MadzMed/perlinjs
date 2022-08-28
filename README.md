# Perlin JS

## Installation

```bash
# npm
npm install perlin-js

# yarn
yarn add perlin-js
```

## Usage

import the class
```js
import { Perlin } from 'perlinjs';
```

instanciate the class
```js
const perlin = new Perlin();
```

use the function you need:

for perlin noise:
```js
// 3D
perlin.noise(x, y, z);

// 2D
perlin.noise(x, y);

// 1D
perlin.noise(x);
```

for perlin fractionnal brownian motion:
```js
// 3D
perlin.fBm(octaves, x, y, z, persistence, lacunarity);

// 2D
perlin.fBm(octaves, x, y, persistence, lacunarity);

// 1D
perlin.fBm(octaves, x, persistence, lacunarity);
```
