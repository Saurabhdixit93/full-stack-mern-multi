const { Router } = require("express");
const router = Router();
const ytdl = require("ytdl-core");

router.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Site Working ...",
  });
});

router.get("/download", async (req, res) => {
  const videoUrl = req.query.url;
  if (!ytdl.validateURL(videoUrl)) {
    return res.json({
      success: false,
      message: "Enter Valid URL .",
    });
  }
  const info = await ytdl.getInfo(videoUrl);
  const videoTitle = info.videoDetails.title;

  try {
    const videoStream = ytdl(videoUrl, { quality: "highest" });
    res.header(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(videoTitle)}.mp4"`
    );
    res.setHeader("Content-Type", "video/mp4");
    res.header("X-Video-Title", encodeURIComponent(videoTitle));
    videoStream.pipe(res);
    videoStream.on("error", (error) => {
      return res.json({
        success: false,
        message: `Error in video Download..! `,
      });
    });
    return;
  } catch (error) {
    return res.json({
      success: false,
      message: "Error downloading the video.",
    });
  }
});

router.use("/user", require("./userRoutes"));
router.use("/news", require("./newsLetter"));
router.use("/auth", require("./passwordReset"));
router.use("/youtube", require("./YoutubeRoutes"));

module.exports = router;
