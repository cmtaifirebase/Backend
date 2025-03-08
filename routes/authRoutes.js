const express = require("express");
const { sendOtp, verifyOtp, resendOtp } = require("../services/authService");
const ResponseManager = require("../utils/responseManager");

const router = express.Router();

// Route to send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    const result = await sendOtp(phone);
    return ResponseManager.successResponse(res, result, result.message);
  } catch (error) {
    return ResponseManager.errorResponse(res, error, "Error sending OTP");
  }
});

// Route to verify OTP (Login or Register)
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp, referredBy } = req.body;

    // Verify OTP and handle user authentication/registration
    const result = await verifyOtp(phone, otp, referredBy);
    
    return ResponseManager.successResponse(res, result, result.message);
  } catch (error) {
    return ResponseManager.errorResponse(res, error, "Error verifying OTP");
  }
});

// Route to resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    const result = await resendOtp(phone);
    return ResponseManager.successResponse(res, result, result.message);
  } catch (error) {
    return ResponseManager.errorResponse(res, error, "Error resending OTP");
  }
});

module.exports = router;
