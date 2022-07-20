const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        productSlug: { type: String, ref: "Product" },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, default: "Russia" }, //Искл
    status: { type: String, default: "Принят" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
