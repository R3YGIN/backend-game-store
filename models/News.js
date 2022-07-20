const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    newsSlug: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    desc: { type: String, required: true },
    link: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
