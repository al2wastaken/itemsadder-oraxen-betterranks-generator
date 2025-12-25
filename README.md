# ItemsAdder / Oraxen Font Tag Generator 

A small tool that generates pixel-font tag images for ItemsAdder/Oraxen or any texture pack.

## Features
- Generate small pixel-font tag PNGs from input text.
- API endpoint to generate images on-the-fly.
- CLI to save images locally.
- Supports automatic darker-shadow color calculation when `darker_color` is set to `0`.

## Contents
- `src/imageMaker.js` — Node.js image generator using `jimp`
- `index.js` — Node.js Express API server.
- `basic.js` — Node.js CLI script.
- `font/` — required font PNGs used to draw each character.

## Requirements

Node.js version:
- Node.js 14+ (recommended)
- npm
- Dependencies (installed with `npm install`): `express`, `jimp`, `color`

## Running the Node.js API

Install dependencies:

```bash
npm install
```

Start the API server:

```bash
npm start
```

Example request:

```
http://localhost:5000/generate-image?text=owner&color=%23ffaaff&darker_color=%23000000
```

Notes:
- URL-encode the `#` sign as `%23` in query parameters.
- Set `darker_color=0` to use automatic darkening of the main color.

## Using the Node.js CLI

Run the interactive CLI:

```bash
npm run basic
```

Follow the prompts to enter the text and colors. The image will be saved to the `output/` folder.

## Adding or modifying font characters

Add or replace PNGs in the `font/` directory. Each character image must be a small RGBA PNG where non-transparent pixels form the glyph. Keep a blank row on top of each glyph image (as the generator expects small 9px-high images).

## License & Credits

Original Python project by al2wastaken. Keep the original LICENSE file for license details.
