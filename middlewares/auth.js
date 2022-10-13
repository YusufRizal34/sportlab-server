const User = require("../models/User");
const jwt = require("jsonwebtoken");

const isLoginWithSession = (req, res, next) => {
  if (req.session.user == null || req.session.user == undefined) {
    req.flash("alertMessage", "Your session is expired");
    req.flash("alertStatus", "danger");
    res.redirect("/admin/signin");
  } else {
    next();
  }
};

const isLoginWithJWT = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    req.user = decoded;
    return next();
  }
  req.user = {
    userSpecAttribute: null,
  };
  next();
};

module.exports = { isLoginWithSession, isLoginWithJWT };
