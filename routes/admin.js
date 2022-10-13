const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { uploadSingle, uploadMultiple } = require("../middlewares/multer");
const { isLoginWithSession } = require("../middlewares/auth");

router.get("/signin", adminController.viewSignin);
router.post("/signin", adminController.actionSignin);
router.use(isLoginWithSession);
router.get("/logout", adminController.actionLogout);
router.get("/dashboard", adminController.viewDashboard);

router.get("/product", adminController.viewProduct);
router.post("/product", uploadSingle, adminController.addProduct);
router.put("/product", uploadSingle, adminController.editProduct);
router.delete("/product/:id", adminController.deleteProduct);

router.get("/user", adminController.viewUser);
router.get("/user/register", adminController.viewRegisterUser);
router.post("/user/register", adminController.addRegisterUser);

module.exports = router;
