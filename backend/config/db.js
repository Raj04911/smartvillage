const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://kumarsharmaraj256_db_user:TdW9WdN1aqPNvATA@cluster0.qmulcz7.mongodb.net/");
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
  }
};

module.exports = connectDB;