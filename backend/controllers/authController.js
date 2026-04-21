const Otp = require("../models/Otp");
const User = require("../models/User");

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
  try {
    const {
      email,
      name = "",
      phone = "",
      state = "",
      district = "",
      purpose = "login"
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    if (purpose === "signup" && (!name || !state || !district)) {
      return res.status(400).json({
        success: false,
        message: "Name, state, and district are required for signup"
      });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({
      email,
      otp,
      expiresAt,
      purpose,
      payload: {
        name,
        phone,
        state,
        district
      }
    });

    res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      otpExpiresAt: expiresAt,
      otpCode: otp,
      devOtp: process.env.NODE_ENV === "production" ? undefined : otp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "OTP not found"
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({
        success: false,
        message: "OTP has expired"
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    let user = await User.findOne({ email });

    if (!user && otpRecord.purpose === "login") {
      return res.status(404).json({
        success: false,
        requiresSignup: true,
        message: "Account not found. Please sign up first."
      });
    }

    if (!user) {
      user = await User.create({
        name: otpRecord.payload?.name,
        email,
        phone: otpRecord.payload?.phone,
        state: otpRecord.payload?.state,
        district: otpRecord.payload?.district,
        role: email === "admin@gmail.com" ? "admin" : "user",
        isVerified: true,
        lastLoginAt: new Date()
      });
    } else {
      user.name = otpRecord.payload?.name || user.name;
      user.phone = otpRecord.payload?.phone || user.phone;
      user.state = otpRecord.payload?.state || user.state;
      user.district = otpRecord.payload?.district || user.district;
      user.isVerified = true;
      user.lastLoginAt = new Date();
      await user.save();
    }

    await Otp.deleteMany({ email });

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
