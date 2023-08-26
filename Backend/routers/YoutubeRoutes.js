const { Router } = require("express");
const {
  convertAudio,
  converVideo,
  downloadVideo,
} = require("../controllers/YoutubeDownloader");

const router = Router();

router.post("/convert-audio", convertAudio);

router.post("/convert-video", converVideo);
router.get("/download-video", downloadVideo);

module.exports = router;
