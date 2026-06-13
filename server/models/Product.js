const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    mainImg: {
      type: String,
    },
    carousel: {
      type: [String],
    },
    sizes: {
      type: [String],
    },
    category: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["men", "women", "kids", "unisex"],
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
