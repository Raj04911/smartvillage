const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      default: ""
    },
    state: {
      type: String,
      default: ""
    },
    district: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    status: {
      type: String,
      enum: ["Active", "Blocked"],
      default: "Active"
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
