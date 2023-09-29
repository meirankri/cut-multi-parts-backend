const express = require('express');
const multer = require('multer');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(cors());

app.post('/cut', upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  console.log('ouech', req.file);

  //  const tmpFile = tmp.fileSync({ postfix: '.mp4' });
  //  fs.writeFileSync(tmpFile.name, req.file.buffer);
  const cut = test({ file: req.file.path });
  console.log('cut', cut);
});

app.use('/segments', express.static('segments'));

app.listen(4000, () => {
  console.log('Server started on http://localhost:4000');
});

const cut = ({ duration = 10 } = {}) => {
  ffmpeg('ace.mp4')
    .on('end', () => {
      //  tmpFile.removeCallback(); // Remove the temporary file
      //  res.json([]);
    })
    .on('error', (err) => {
      console.error(err);
      //  tmpFile.removeCallback(); // Remove the temporary file
      res.status(500).send('Error processing video.');
    })
    .on('segment', (info) => {
      parts.push(`/segments/${info.filename}`);
    })
    .output('./segments/')
    .addOptions([
      `-f segment`,
      `-segment_time ${duration}`,
      `-c copy`,
      `./segments/out%03d.mp4`
    ])
    .run();
};

const test = ({ file } = {}) => {
  return ffmpeg(file)
    .audioCodec('copy')
    .videoCodec('copy')
    .outputOptions(['-f segment', '-segment_time 5', '-reset_timestamps 1'])
    .on('end', function () {
      console.log('Files have been segmented.');
    })
    .on('error', function (err) {
      console.error('Error:', err);
    })
    .save(`out/output_part_%02d.mp4`);
};
