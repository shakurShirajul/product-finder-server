import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    requrired: true,
  },
  category: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    requrired: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    requrired: true,
  },
});

productSchema.index({ name: "text" }, { default_language: "none" });

export const Products = mongoose.model("products", productSchema);
