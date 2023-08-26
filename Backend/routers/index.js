const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Site Working ...",
  });
});

router.use("/user", require("./userRoutes"));
router.use("/news", require("./newsLetter"));
router.use("/auth", require("./passwordReset"));
router.use("/youtube", require("./YoutubeRoutes"));

module.exports = router;
