const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Crop = require("./models/Crop");
const User = require("./models/User");
const Order = require("./models/Order");

dotenv.config();

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(express.json());

const userSeed = [
  {
    name: "Admin User",
    email: "admin@gmail.com",
    phone: "9999999999",
    state: "Maharashtra",
    district: "Nashik",
    role: "admin",
    status: "Active",
    isVerified: true,
    lastLoginAt: new Date()
  },
  {
    name: "Ravi Kumar",
    email: "ravi@example.com",
    phone: "9876543210",
    state: "Karnataka",
    district: "Kolar",
    role: "user",
    status: "Active",
    isVerified: true,
    lastLoginAt: new Date()
  },
  {
    name: "Anita Sharma",
    email: "anita@example.com",
    phone: "9876501234",
    state: "Punjab",
    district: "Ludhiana",
    role: "user",
    status: "Active",
    isVerified: true,
    lastLoginAt: new Date()
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart-dashboard-system"
    );
    console.log("MongoDB Atlas Connected Successfully");
    await seedDatabase();
  } catch (error) {
    console.error("MongoDB Connection Failed:");
    console.error(error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  const dummyCropNames = [
    "Basmati Rice",
    "Wheat",
    "Tomato",
    "Onion",
    "Sugarcane",
    "Potato",
    "Cotton",
    "Maize"
  ];

  await Crop.deleteMany({ name: { $in: dummyCropNames } });

  const [cropCount, userCount, orderCount] = await Promise.all([
    Crop.countDocuments(),
    User.countDocuments(),
    Order.countDocuments()
  ]);

  if (userCount === 0) {
    await User.insertMany(userSeed);
    console.log("Seeded users");
  }

  if (orderCount === 0) {
    const users = await User.find();
    const crops = await Crop.find();

    if (users.length && crops.length) {
      await Order.insertMany([
        {
          userId: users[1]?._id?.toString() || users[0]._id.toString(),
          userName: users[1]?.name || users[0].name,
          userEmail: users[1]?.email || users[0].email,
          state: users[1]?.state || users[0].state,
          district: users[1]?.district || users[0].district,
          items: [
            {
              cropId: crops[2]._id.toString(),
              name: crops[2].name,
              state: crops[2].state,
              district: crops[2].district,
              price: crops[2].price,
              quantity: 25,
              total: crops[2].price * 25
            }
          ],
          totalAmount: crops[2].price * 25,
          status: "Pending"
        },
        {
          userId: users[2]?._id?.toString() || users[0]._id.toString(),
          userName: users[2]?.name || users[0].name,
          userEmail: users[2]?.email || users[0].email,
          state: users[2]?.state || users[0].state,
          district: users[2]?.district || users[0].district,
          items: [
            {
              cropId: crops[0]._id.toString(),
              name: crops[0].name,
              state: crops[0].state,
              district: crops[0].district,
              price: crops[0].price,
              quantity: 15,
              total: crops[0].price * 15
            },
            {
              cropId: crops[1]._id.toString(),
              name: crops[1].name,
              state: crops[1].state,
              district: crops[1].district,
              price: crops[1].price,
              quantity: 30,
              total: crops[1].price * 30
            }
          ],
          totalAmount: crops[0].price * 15 + crops[1].price * 30,
          status: "Delivered"
        }
      ]);
      console.log("Seeded orders");
    }
  }
};

connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/crops", require("./routes/crops"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/notifications", require("./routes/notifications"));

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
