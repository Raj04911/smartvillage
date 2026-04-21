const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    scientificName: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: "General"
    },
    state: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: "kg"
    },
    season: {
      type: String,
      default: ""
    },
    waterRequirement: {
      type: String,
      default: ""
    },
    soilType: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    demandLevel: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      default: "Moderate"
    },
    trend: {
      type: Number,
      default: 0
    },
    aiScore: {
      type: Number,
      default: 0
    },
    priceHistory: {
      type: [Number],
      default: []
    },
    demandHistory: {
      type: [Number],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Crop", cropSchema);
