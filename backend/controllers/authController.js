const Otp = require("../models/Otp");
const User = require("../models/User");
const Notification = require("../models/Notification");

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
      addressLine = "",
      pincode = "",
      coordinates = {},
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

    const otp = email === "admin@gmail.com" ? "123456" : generateOtp();
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
        district,
        addressLine,
        pincode,
        coordinates
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
        addressLine: otpRecord.payload?.addressLine,
        pincode: otpRecord.payload?.pincode,
        coordinates: otpRecord.payload?.coordinates || {},
        role: email === "admin@gmail.com" ? "admin" : "user",
        isVerified: true,
        lastLoginAt: new Date()
      });

      await Notification.create([
        {
          audience: "user",
          userId: user._id.toString(),
          title: "Welcome aboard",
          message: `Your account for ${user.district}, ${user.state} is now active.`,
          type: "account"
        },
        {
          audience: "admin",
          userId: null,
          title: "New user registered",
          message: `${user.name} joined from ${user.district}, ${user.state}.`,
          type: "account"
        }
      ]);
    } else {
      user.name = otpRecord.payload?.name || user.name;
      user.phone = otpRecord.payload?.phone || user.phone;
      user.state = otpRecord.payload?.state || user.state;
      user.district = otpRecord.payload?.district || user.district;
      user.addressLine = otpRecord.payload?.addressLine || user.addressLine;
      user.pincode = otpRecord.payload?.pincode || user.pincode;
      user.coordinates = otpRecord.payload?.coordinates?.lat
        ? otpRecord.payload.coordinates
        : user.coordinates;
      user.isVerified = true;
      user.lastLoginAt = new Date();
      await user.save();

      await Notification.create({
        audience: "user",
        userId: user._id.toString(),
        title: "Login successful",
        message: `You signed in successfully on ${new Date().toLocaleDateString("en-IN")}.`,
        type: "account"
      });
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

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after"
    });

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
