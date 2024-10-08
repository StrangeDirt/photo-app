var express = require("express");
var router = express.Router();
const path = require("path");
const getFiles = require("../utils/getFiles");
require("dotenv").config();

const directoryPath = path.join(__dirname, process.env.VIDEO_DATA_DIR);

router.get("/", async function (req, res, next) {
  try {
    const images = await getFiles(".mp4", directoryPath);
    res.send(images);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
