const express = require('express');
const ImageMaker = require('./src/imageMaker');

const app = express();

app.get('/generate-image', async (req, res) => {
  const text = (req.query.text.length == 0 ? 'kitamor' : req.query.text).toString();
  const color = req.query.color || '#ffaaff';
  const darker_color = req.query.darker_color;

  try {
    const maker = new ImageMaker(text, color, darker_color);
    const buffer = await maker.getImageBuffer();
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('error generating image');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
