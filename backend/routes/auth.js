const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, getUsers, updateProfile } = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/users", getUsers);
router.put("/users/:userId", updateProfile);

module.exports = router;
