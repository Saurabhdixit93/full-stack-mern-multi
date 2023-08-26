const { Router } = require("express");
const router = Router();
const { subscribeNews } = require("../controllers/NewsLetterConfirm");

router.post("/subscribe", subscribeNews);
module.exports = router;
