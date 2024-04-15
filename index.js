const express = require("express");
const multer = require("multer");
const cors = require("cors");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const app = express();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(cors());

app.post("/cut", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  console.log("ouech", req.file);

  test({
    file: req.file.path,
    filename: req.file.originalname
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-"),
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/segments", express.static("segments"));

app.listen(8080, () => {
  console.log("Server started on http://localhost:8080");
});

const test = ({ file, filename } = {}) => {
  if (!fs.existsSync(`out/${filename}`)) {
    fs.mkdirSync(`out/${filename}`);
  }
  return ffmpeg(file)
    .audioCodec("copy")
    .videoCodec("copy")
    .outputOptions(["-f segment", "-segment_time 70", "-reset_timestamps 1"])
    .on("end", function () {
      console.log("Files have been segmented.");
    })
    .on("error", function (err) {
      console.error("Error:", err);
    })
    .save(`out/${filename}/output_part_%02d.mp4`);
};

const cut = ({ duration = 10 } = {}) => {
  ffmpeg("ace.mp4")
    .on("end", () => {
      //  tmpFile.removeCallback(); // Remove the temporary file
      //  res.json([]);
    })
    .on("error", (err) => {
      console.error(err);
      //  tmpFile.removeCallback(); // Remove the temporary file
      res.status(500).send("Error processing video.");
    })
    .on("segment", (info) => {
      parts.push(`/segments/${info.filename}`);
    })
    .output("./segments/")
    .addOptions([
      `-f segment`,
      `-segment_time ${duration}`,
      `-c copy`,
      `./segments/out%03d.mp4`,
    ])
    .run();
};
