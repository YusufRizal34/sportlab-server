const Product = require("../models/Product");
const User = require("../models/User");
const path = require("path");
const fs = require("fs-extra");
const bcrypt = require("bcryptjs");
const { userValidation } = require("../middlewares/userValidation");

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user == null || req.session.user == undefined) {
        res.render("index", {
          alert,
          title: "Staycation | Login",
        });
      } else {
        res.redirect("/admin/dashboard");
      }
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username });

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash(
          "alertMessage",
          "Username atau password yang dimasukkan tidak cocok"
        );
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      res.redirect("/admin/dashboard");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/signin");
    }
  },
  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin/signin");
  },
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/view_dashboard", {
      title: "Staycation | Dashboard",
      user: req.session.user,
    });
  },
  viewProduct: async (req, res) => {
    const product = await Product.find();
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("admin/product/view_product", {
      product,
      alert,
      title: "Staycation | Product",
      user: req.session.user,
    });
  },
  addProduct: async (req, res) => {
    try {
      const { name, brand, price, city } = req.body;
      await Product.create({
        name,
        brand,
        price,
        city,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMessage", "Success Add Product");
      req.flash("alertStatus", "success");
      res.redirect("/admin/product");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/product");
    }
  },
  editProduct: async (req, res) => {
    try {
      const { id, name, brand, price, city } = req.body;
      const product = await Product.findOne({ _id: id });
      product.name = name;
      product.brand = brand;
      product.price = price;
      product.city = city;
      if (req.file !== undefined) {
        await fs.unlink(path.join(`public/${product.imageUrl}`));
        product.imageUrl = `images/${req.file.filename}`;
      }
      await product.save();
      req.flash("alertMessage", "Success Edit Product");
      req.flash("alertStatus", "success");
      res.redirect("/admin/product");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/product");
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findOne({ _id: id });
      await fs.unlink(path.join(`public/${product.imageUrl}`));
      await product.remove();
      req.flash("alertMessage", "Success Delete Product");
      req.flash("alertStatus", "success");
      res.redirect("/admin/product");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/product");
    }
  },
  viewUser: async (req, res) => {
    const users = await User.find();
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("admin/user/view_user", {
      users,
      alert,
      title: "Staycation | User",
      user: req.session.user,
    });
  },
  viewRegisterUser: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("admin/user/register/view_register", {
      alert,
      title: "Staycation | Register",
    });
  },
  addRegisterUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const messages = userValidation(req.body);

      if (messages.length > 0) {
        req.flash("alertMessage", messages[0]);
        req.flash("alertStatus", "danger");
        return res.redirect("/admin/user/register");
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      await User.create({
        username: username,
        email: email,
        password: encryptedPassword,
      });

      req.flash("alertMessage", "Success Register");
      req.flash("alertStatus", "success");
      res.redirect("/admin/user");
    } catch (error) {
      if (error.code === 11000) {
        req.flash("alertMessage", "Email is already used");
      } else {
        req.flash("alertMessage", `${error.message}`);
      }
      req.flash("alertStatus", "danger");
      res.redirect("/admin/user/register");
    }
  },
};
