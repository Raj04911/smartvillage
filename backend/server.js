const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Crop = require("./models/Crop");

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas Connected Successfully");
    seedCrops();
  } catch (error) {
    console.error("MongoDB Connection Failed:");
    console.error(error.message);
    process.exit(1);
  }
};

const seedCrops = async () => {
  const count = await Crop.countDocuments();
  if (count === 0) {
    await Crop.insertMany([
      { name: "Wheat", price: 25, stock: 100 },
      { name: "Rice", price: 30, stock: 80 },
      { name: "Tomato", price: 20, stock: 60 },
      { name: "Onion", price: 18, stock: 75 }
    ]);
    console.log("Sample crops inserted");
  }
};

connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/crops", require("./routes/crops"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));

app.get("/", (req, res) => {
  res.json({ message: "Smart Village Backend Running" });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});