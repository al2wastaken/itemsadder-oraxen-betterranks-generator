const Jimp = require('jimp');
const Color = require('color');
const path = require('path');

const chars = {
  "a": "./font/a.png", "b": "./font/b.png", "c": "./font/c.png",
  "d": "./font/d.png", "e": "./font/e.png", "f": "./font/f.png",
  "g": "./font/g.png", "h": "./font/h.png", "i": "./font/i.png",
  "ı": "./font/ı.png", "j": "./font/j.png", "k": "./font/k.png",
  "l": "./font/l.png", "m": "./font/m.png", "n": "./font/n.png", 
  "o": "./font/o.png","p": "./font/p.png", "r": "./font/r.png", 
  "s": "./font/s.png","t": "./font/t.png", "u": "./font/u.png", 
  "v": "./font/v.png","y": "./font/y.png", "z": "./font/z.png", 
  "q": "./font/q.png","w": "./font/w.png", "x": "./font/x.png", 
  "0": "./font/0.png","1": "./font/1.png", "2": "./font/2.png", 
  "3": "./font/3.png","4": "./font/4.png", "5": "./font/5.png", 
  "6": "./font/6.png","7": "./font/7.png", "8": "./font/8.png",
  "9": "./font/9.png", "ı": "./font/dotless_i.png", "ğ": "./font/g_with_cap.png",
  "ç": "./font/c_with_dot.png", "ş": "./font/s_with_dot.png", "ö": "./font/o_with_dot.png",
  "ü": "./font/u_with_dot.png", "+": "./font/plus.png", '"': "./font/plus.png"
};

function resolvePath(p) {
  return path.resolve(__dirname, '..', p.replace(/^\.\//, ''));
}

class ImageMaker {
  static getDarkerColor(hexColor) {
    const c = Color(hexColor);
    const hsv = c.hsv().array();
    const newV = hsv[2] * 0.7;
    const darker = Color.hsv(hsv[0], hsv[1], newV).hex();
    return darker;
  }

  constructor(inputText, inputColor, darkerInputColor) {
    this.inputText = inputText.toString().toLowerCase();
    this.inputColor = inputColor;
    this.darkerInputColor = (darkerInputColor === '0') ? ImageMaker.getDarkerColor(inputColor) : darkerInputColor;
    this.image = null;
    this.charCache = {};
  }

  async init() {
    this.image = await this.createImage();
    await this.writeTextShadow();
    await this.writeText();
  }

  findCharWidth(char) {
    return char === ' ' ? 3 : (this.charCache[char] ? this.charCache[char].bitmap.width : null);
  }

  async findImageWidth() {
    let width = 4;
    for (const ch of this.inputText) {
      if (ch === ' ') {
        width += 3 + 1;
      } else {
        const img = await this._loadChar(ch);
        width += img.bitmap.width + 1;
      }
    }
    width -= 1;
    return width;
  }

  async createImage() {
    const width = await this.findImageWidth();
    const image = new Jimp(width, 9, this.darkerInputColor);
    const rectW = Math.max(0, width - 2);
    const rect = new Jimp(rectW, 7, this.inputColor);
    image.composite(rect, 1, 1);
    return image;
  }

  async _loadChar(char) {
    if (char === ' ') return null;
    if (this.charCache[char]) return this.charCache[char];
    const map = chars[char];
    if (!map) throw new Error(`Missing font for char: ${char}`);
    const p = resolvePath(map);
    const img = await Jimp.read(p);
    this.charCache[char] = img;
    return img;
  }

  async changeNonTransparentPixelsColor(imagePathOrJimp, newColor) {
    let img = imagePathOrJimp;
    if (!(img instanceof Jimp)) {
      img = await Jimp.read(resolvePath(imagePathOrJimp));
    } else {
      img = img.clone();
    }
    const rgb = Color(newColor).rgb().array();
    const [r, g, b] = rgb;
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
      const alpha = this.bitmap.data[idx + 3];
      if (alpha !== 0) {
        this.bitmap.data[idx + 0] = r;
        this.bitmap.data[idx + 1] = g;
        this.bitmap.data[idx + 2] = b;
      }
    });
    return img;
  }

  async pasteCharShadow(char, offset) {
    if (char === ' ') return;
    const src = await this._loadChar(char);
    const recolored = await this.changeNonTransparentPixelsColor(src, this.darkerInputColor);
    this.image.composite(recolored, offset[0], offset[1]);
  }

  async pasteChar(char, offset) {
    if (char === ' ') return;
    const src = await this._loadChar(char);
    this.image.composite(src, offset[0], offset[1]);
  }

  async writeTextShadow() {
    let offsetX = 3;
    for (const ch of this.inputText) {
      await this.pasteCharShadow(ch, [offsetX, 0]);
      if (ch === ' ') offsetX += 3 + 1; else offsetX += this.charCache[ch].bitmap.width + 1;
    }
  }

  async writeText() {
    let offsetX = 2;
    for (const ch of this.inputText) {
      await this.pasteChar(ch, [offsetX, 0]);
      if (ch === ' ') offsetX += 3 + 1; else offsetX += this.charCache[ch].bitmap.width + 1;
    }
  }

  async getImageBuffer() {
    if (!this.image) await this.init();
    return await this.image.getBufferAsync(Jimp.MIME_PNG);
  }

  async saveImage(outPath) {
    if (!this.image) await this.init();
    const p = path.resolve(outPath);
    await this.image.writeAsync(p);
    return p;
  }
}

module.exports = ImageMaker;
