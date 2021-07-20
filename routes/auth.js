const express = require("express")
const router = express.Router()
const { upload } = require("../util/upload");
const authenticate = require("../middleware/authenticate")
const AuthController = require("../controllers/AuthController");
const adminController = require("../controllers/adminController")
const singleUpload = upload.single('profileImage');

//user-register
router.post("/register", [singleUpload], AuthController.register)
//user-login
router.post("/login", AuthController.login)
//user-update
router.patch("/update/:id", authenticate, singleUpload, AuthController.update)
//user-delete
router.delete("/delete/:id", authenticate, AuthController.remove)
//user-disable
router.patch("/disable/:id", authenticate, AuthController.disable)
//change-password-user
router.patch("/change/:id", authenticate, AuthController.change)
//admin-register
router.post("/registerAdmin", adminController.registerad)
//admin-login
router.post("/loginAdmin", adminController.loginad)
//admin-delete
router.delete("/deleteAdmin/:id", authenticate, adminController.removead)
//admin-disable
router.patch("/disableAdmin/:id", authenticate, adminController.disablead)

module.exports = router