const { Router } = require("express");
const router = Router();
const { verifyToken } = require("../config/verifyToken");
const {
  userLogin,
  newUserAccount,
  deleteUser,
  updateUser,
  verifyOtp,
  currentUser,
} = require("../controllers/userController");

router.post("/sign_up", newUserAccount);
router.post("/login", userLogin);
router.get("/current-user/:userId", currentUser);
router.post("/verify-otp", verifyOtp);
router.put("/:userId/update-account", verifyToken, updateUser);
router.delete("/:userId/delete-account", verifyToken, deleteUser);

module.exports = router;
