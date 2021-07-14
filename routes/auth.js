const express = require("express")
const router = express.Router()
const { upload } = require("../util/upload");
const authenticate = require("../middleware/authenticate")
const AuthController = require("../controllers/AuthController");
const adminController = require("../controllers/adminController")
const singleUpload = upload.single('profileImage');
//user-register
router.post("/registerUser", [singleUpload], AuthController.register)
//user-login
router.post("/loginUser", AuthController.login)
//user-update
router.patch("/updateUser/:id", authenticate, singleUpload, AuthController.update)
//user-delete
router.delete("/deleteUser/:id", authenticate, AuthController.remove)
//user-disable
router.disableUser("/disableUser/:id", authenticate, AuthController.disable)
//change-password
router.patch("/change/:email", authenticate.apply, AuthController.change)
//admin-register
router.post("/registerAdmin", adminController.adregister)
//admin-login
router.post("/loginAdmin", adminController.adlogin)
//admin-delete
router.post("/deleteAdmin/", authenticate, adminController.adremove)
//admin-disable
router.post("/disableAdmin/", authenticate, adminController.disableAdmin)



module.exports = router