const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  pinNumber: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Bank", bankSchema);
