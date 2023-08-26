const axios = require("axios");
const ytdl = require("ytdl-core");

exports.convertAudio = async (req, res) => {
  const { videoUrl, quality } = req.body;
 if (!videoUrl || !ytdl.validateURL(videoUrl)) {
      return res.json({
        success: false,
        message: "Please Enter A Valid Youtube URL",
      });
    }
  if (!videoUrl || !quality) {
    return res.json({
      message: "Video Url anad quality required *",
      success: false,
    });
  }

  const options = {
    method: "GET",
    url: process.env.RAPID_API_URL,
    params: {
      url: videoUrl,
      quality: quality,
    },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": process.env.RAPID_API_HOST,
    },
  };
  try {
    const response = await axios.request(options);
    if (!response) {
      return res.json({
        success: false,
        message: "Audio not availble !",
      });
    }
    const fileDetails = response.data;
    return res.json({
      success: true,
      fileDetails,
      message: "Audio converted please download .",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error !",
    });
  }
};

module.exports.converVideo = async (req, res) => {
  try {
    const { videoUrl } = req.body;
    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
      return res.json({
        success: false,
        message: "Please Enter A Valid Youtube URL",
      });
    }
    const info = await ytdl.getInfo(videoUrl);
    const data = info.formats.filter(
      (format) => format.hasVideo && format.hasVideo
    );
    const video = {
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      thumbnail: info.videoDetails.thumbnails[0].url,
      formats: data,
      url: videoUrl,
    };
    return res.json({
      success: true,
      fileDetails: video,
      message: "Converted Successfully, Please download.",
    });
  } catch (error) {
    return res.json({
      error: error,
      success: false,
      message: "Internal Server Error ...",
    });
  }
};

exports.downloadVideo = async (req, res) => {
  try {
    const url = req.query.url;
    const format = req.query.format;
    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title;
    const videoFileName = `${videoTitle}.${format}.mp4`;
    const videoStream = ytdl(url, { format: format });
    const contentDispositionHeader = `attachment; filename*=UTF-8''${encodeURIComponent(
      videoFileName
    )}`;
    res.setHeader("Content-Disposition", contentDispositionHeader);
    res.setHeader("Content-Type", "video/mp4");
    videoStream.pipe(res);
    videoStream.on("error", (error) => {
      return res.json({
        success: false,
        error: error.message,
        message: `Internal Server Error ..! `,
      });
    });
    return res.json({
      success: true,
      message: `Download started .. `,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: error,
      message: `Internal Server Error ..! `,
    });
  }
};
