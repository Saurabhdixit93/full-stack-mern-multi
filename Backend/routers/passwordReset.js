const { Router } = require("express");
const router = Router();
const {
  sendPasswordResetLink,
  handlePasswordLink,
  updatePassword,
} = require("../controllers/PasswordResetController");

router.post("/send-link", sendPasswordResetLink);
router.get("/verify-link", handlePasswordLink);
router.post("/update-password", updatePassword);
module.exports = router;
