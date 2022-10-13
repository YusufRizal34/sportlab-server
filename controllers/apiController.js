const Product = require("../models/Product");
const User = require("../models/User");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const products = await Product.find().limit(4);
      const newArrival = await Product.find();
      const user = req.user.userSpecAttribute;
      if (user) return res.status(200).json({ products, newArrival, user });
      res.status(200).json({ products, newArrival });
    } catch (error) {
      res.status(500).json("Internal server error", error);
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findOne({ _id: id });
      const user = req.user.userSpecAttribute;
      if (user) return res.status(200).json({ product, user });
      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  shopPage: async (req, res) => {
    try {
      const products = await Product.find();
      const user = req.user.userSpecAttribute;
      if (user) return res.status(200).json({ products, user });
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json("Internal server error", error);
    }
  },
};
