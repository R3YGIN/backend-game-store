const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    productSlug: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    wideImg: { type: String, required: true },
    slider: { type: Array, required: true },
    developer: { type: String, required: true },
    publisher: { type: String, required: true },
    releaseDate: { type: String, required: true },
    platform: { type: String, required: true },
    about: { type: String, required: true },
    desc: { type: String, required: true },
    genre: { type: Array },
    price: { type: Number, required: true },
    sale: { type: Number, default: 0 },
    requirements: {
      os: {
        min: { type: String, default: "-" },
        rec: { type: String, default: "-" },
      },
      processor: {
        min: { type: String, default: "-" },
        rec: { type: String, default: "-" },
      },
      memory: {
        min: { type: String, default: "-" },
        rec: { type: String, default: "-" },
      },
      storage: {
        min: { type: String, default: "-" },
        rec: { type: String, default: "-" },
      },
      direct: {
        min: { type: String, default: "-" },
        rec: { type: String, default: "-" },
      },
      graphics: {
        min: { type: String, default: "-" },
        rec: { type: String, default: "-" },
      },
      drm: { type: String },
      languages: { type: String, default: "Русский, Английский" },
    }, //сис. требования
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
