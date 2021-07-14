const express = require("express")
const router = express.Router()
const { upload } = require("../util/upload");
const authenticate = require("../middleware/authenticate")
const AuthController = require("../controllers/AuthController");
const adminController = require("../controllers/adminController")
const singleUpload = upload.single('profileImage');
//user-register
router.post("/register-user", [singleUpload], AuthController.register)

//admin-register
router.post("/register-admin", adminController.adregister)

//admin-login
router.post("/login", AuthController.login)
//admin-update
router.patch("/update/:id", authenticate, singleUpload, AuthController.update)
//admin-show
router.get("/show/:id", authenticate, AuthController.show)
//admin-delete
router.delete("/delete/:id", authenticate, AuthController.remove)
//change-password
router.patch("/change/:email", authenticate.apply, AuthController.change)


module.exports = router