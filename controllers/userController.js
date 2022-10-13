const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

module.exports = {
  register: async (req, res) => {
    try {
      res.status(200).json({ message: "HMMMM" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  viewLogin: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(401);
    }
    try {
      const isTokenAvaible = await User.findOne({
        refreshToken: refreshToken,
      });
      if (!isTokenAvaible) {
        return res.sendStatus(401);
      }
      const user = req.user.userSpecAttribute;
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  actionLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      const userSpecAttribute = {
        _id: user._id,
        email: user.email,
        username: user.username,
      };

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return req
          .status(400)
          .json("Username atau password yang dimasukkan tidak cocok");
      }
      const refreshToken = jwt.sign(
        { userSpecAttribute },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      user.refreshToken = refreshToken;
      await user.save();
      res.cookie("refreshToken", refreshToken);
      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  logout: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.sendStatus(401);
      const user = await User.findOne({ refreshToken: refreshToken });
      if (!user) return res.status(204).json({ message: "User not found" });
      user.refreshToken = null;
      user.save();
      res;
      res.clearCookie("refreshToken").sendStatus(200);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  userProfile: async (req, res) => {
    try {
      const id = req.user.userSpecAttribute._id;
      const userData = await User.findOne({ _id: id });
      const user = {
        _id: userData._id,
        email: userData.email,
        username: userData.username,
        role: userData.role,
      };
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};
