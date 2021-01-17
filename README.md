# Game of Life in WASM

## Building

First, you must have `wasm-pack` installed. [Go!](https://rustwasm.github.io/wasm-pack/)

Then simply type:

```
wasm-pack build
```

This will generate a `pkg` folder that contains the library as a JS module (or whatever its called, IDK, something that can be used as a dependency in JS).
Like so,

```typescript
import { Universe, Cell } from "fraud-game-of-life"; // <<=== WASM
```

And to publish to NPM is as easy as,

```
wasm-pack publish
```

## Test

After building the library, head over to `www` folder.
Inside, simply install and run the sample project consuming this library.

```
npm install
npm run start
```

## Note

This repository does not look nice, but it does contain the auto generated stuff just for show.
