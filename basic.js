const readline = require('readline');
const ImageMaker = require('./src/imageMaker');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function question(q) {
  return new Promise(resolve => rl.question(q, ans => resolve(ans)));
}

(async () => {
  let inputText = await question('Enter your text: ');
  if (inputText.length === 0) inputText = 'kitamor';
  const inputColor = await question('Enter your color (hex, e.g. #ffaaff): ');
  const darkerInputColor = await question('Enter your darker color (or 0 for auto): ');
  rl.close();

  try {
    const maker = new ImageMaker(inputText, inputColor || '#ffaaff', darkerInputColor || '0');
    const outDir = path.resolve('output');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${inputText}.png`);
    await maker.saveImage(outPath);
    console.log('Image saved as ' + outPath);
  } catch (err) {
    console.error('Error:', err);
  }
})();
