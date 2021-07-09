const express = require("express")
const router = express.Router()
const { upload } = require("../util/upload");
const authenticate = require("../middleware/authenticate")
const AuthController = require("../controllers/AuthController");

const singleUpload = upload.single('profileImage');
//user-register
router.post("/register-user", [singleUpload], AuthController.register)

//admin-register
router.post("/register-admin", AuthController.register)

//admin-login
router.post("/login", AuthController.login)
//admin-update
router.patch("/update/:id", authenticate, singleUpload, AuthController.update)
//admin-show
router.get("/show/:id", authenticate, AuthController.show)
//admin-delete
router.delete("/delete/:id", authenticate, AuthController.remove)
//change-password
router.post("/change/:id", authenticate.apply, AuthController.change)
//save admin
//router.post("/", Authcontroller)
module.exports = router