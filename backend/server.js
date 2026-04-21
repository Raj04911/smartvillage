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

const cropSeed = [
  {
    name: "Basmati Rice",
    scientificName: "Oryza sativa",
    category: "Cereal",
    state: "Punjab",
    district: "Ludhiana",
    price: 68,
    stock: 420,
    season: "Kharif",
    soilType: "Alluvial",
    waterRequirement: "High",
    demandLevel: "High",
    trend: 6,
    aiScore: 88,
    description: "Premium aromatic rice with strong export demand.",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6",
    priceHistory: [60, 62, 63, 65, 66, 68],
    demandHistory: [72, 78, 81, 84, 86, 89]
  },
  {
    name: "Wheat",
    scientificName: "Triticum aestivum",
    category: "Cereal",
    state: "Uttar Pradesh",
    district: "Meerut",
    price: 31,
    stock: 560,
    season: "Rabi",
    soilType: "Loamy",
    waterRequirement: "Moderate",
    demandLevel: "High",
    trend: 4,
    aiScore: 84,
    description: "High-yield wheat suitable for flour mills and bulk buyers.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b",
    priceHistory: [26, 27, 28, 29, 30, 31],
    demandHistory: [64, 67, 70, 74, 78, 82]
  },
  {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    category: "Vegetable",
    state: "Karnataka",
    district: "Kolar",
    price: 24,
    stock: 330,
    season: "Year-round",
    soilType: "Sandy Loam",
    waterRequirement: "Moderate",
    demandLevel: "High",
    trend: 8,
    aiScore: 90,
    description: "Fast-moving mandi crop with strong retail demand.",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337",
    priceHistory: [16, 18, 19, 20, 22, 24],
    demandHistory: [70, 74, 79, 83, 88, 91]
  },
  {
    name: "Onion",
    scientificName: "Allium cepa",
    category: "Vegetable",
    state: "Maharashtra",
    district: "Nashik",
    price: 28,
    stock: 610,
    season: "Rabi",
    soilType: "Black Soil",
    waterRequirement: "Low",
    demandLevel: "High",
    trend: 5,
    aiScore: 86,
    description: "Storage-friendly onion crop with broad national demand.",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510",
    priceHistory: [22, 23, 24, 25, 27, 28],
    demandHistory: [61, 66, 71, 76, 79, 84]
  },
  {
    name: "Sugarcane",
    scientificName: "Saccharum officinarum",
    category: "Cash Crop",
    state: "Maharashtra",
    district: "Kolhapur",
    price: 12,
    stock: 980,
    season: "Annual",
    soilType: "Clay Loam",
    waterRequirement: "High",
    demandLevel: "Moderate",
    trend: 3,
    aiScore: 76,
    description: "Factory-linked crop with strong industrial usage.",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae",
    priceHistory: [10, 10.5, 11, 11.2, 11.5, 12],
    demandHistory: [58, 60, 61, 63, 67, 70]
  },
  {
    name: "Potato",
    scientificName: "Solanum tuberosum",
    category: "Vegetable",
    state: "West Bengal",
    district: "Hooghly",
    price: 22,
    stock: 450,
    season: "Rabi",
    soilType: "Alluvial",
    waterRequirement: "Moderate",
    demandLevel: "Moderate",
    trend: 2,
    aiScore: 74,
    description: "Staple crop with stable volume demand across cities.",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655",
    priceHistory: [18, 18.5, 19, 20, 21, 22],
    demandHistory: [52, 55, 57, 60, 63, 67]
  },
  {
    name: "Cotton",
    scientificName: "Gossypium",
    category: "Fiber",
    state: "Gujarat",
    district: "Rajkot",
    price: 74,
    stock: 230,
    season: "Kharif",
    soilType: "Black Soil",
    waterRequirement: "Moderate",
    demandLevel: "Moderate",
    trend: 4,
    aiScore: 80,
    description: "Textile-driven crop with strong procurement cycles.",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea",
    priceHistory: [66, 67, 69, 70, 72, 74],
    demandHistory: [56, 59, 63, 65, 69, 72]
  },
  {
    name: "Maize",
    scientificName: "Zea mays",
    category: "Cereal",
    state: "Bihar",
    district: "Purnia",
    price: 26,
    stock: 370,
    season: "Kharif",
    soilType: "Silty Loam",
    waterRequirement: "Moderate",
    demandLevel: "Moderate",
    trend: 5,
    aiScore: 82,
    description: "Feed and food crop with rising procurement potential.",
    image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc",
    priceHistory: [21, 22, 23, 24, 25, 26],
    demandHistory: [55, 58, 61, 66, 71, 74]
  }
];

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
  const [cropCount, userCount, orderCount] = await Promise.all([
    Crop.countDocuments(),
    User.countDocuments(),
    Order.countDocuments()
  ]);

  if (cropCount === 0) {
    await Crop.insertMany(cropSeed);
    console.log("Seeded crops");
  }

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
