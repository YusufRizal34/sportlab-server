const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: ObjectId,
    ref: "Product",
    required: true,
  },
  bankId: {
    type: ObjectId,
    ref: "Bank",
    required: true,
  },
  qty: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: "Waiting",
  },
});

module.exports = mongoose.model("Cart", cartSchema);
