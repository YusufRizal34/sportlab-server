const router = require("express").Router();
const apiController = require("../controllers/apiController");
const userController = require("../controllers/userController");
const { isLoginWithJWT } = require("../middlewares/auth");
// const { uploadSingle, uploadMultiple } = require("../middlewares/multer");

router.get("/login", userController.viewLogin);
router.post("/login", userController.actionLogin);
router.post("/register", userController.register);
router.delete("/logout", isLoginWithJWT, userController.logout);
router.get("/profile-page", isLoginWithJWT, userController.userProfile);

router.get("/landing-page", isLoginWithJWT, apiController.landingPage);
router.get("/detail-page/:id", isLoginWithJWT, apiController.detailPage);
router.get("/shop-page", isLoginWithJWT, apiController.shopPage);

module.exports = router;
