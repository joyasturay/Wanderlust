const express = require('express');
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const saveredirecturl=require("../middleware.js").saveredirecturl;
const userController=require("../controllers/users.js");
router.route("/signup").get(userController.renderSignUpForm)
.post(wrapAsync(userController.Signup));
router.route("/login").get(userController.renderLoginForm)
.post(saveredirecturl,
passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),userController.loginForm);
router.get("/logout",userController.logout);
module.exports = router;