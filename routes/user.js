const express = require('express');
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const saveredirecturl=require("../middleware.js").saveredirecturl;
router.get("/signup",(req,res)=>{
    res.render("users/signup");
});
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {email,username,password}=req.body;
        let user=new User({email,username});
        let registeredUser=await User.register(user,password);
       console.log(registeredUser);
       req.login(registeredUser,(err)=>{
           if(err){
            return next(err);
           }
           req.flash("success","welcome to WANDERLUST");
           res.redirect("/listings");
       })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",saveredirecturl,
passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),async (req,res)=>{
    req.flash("success","welcome back");
    let redirecturl=res.locals.redirecturl || "/listings";
    res.redirect(redirecturl);
});
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            req.flash("error",err.message);
            return next(err);
        }
        req.flash("success","goodbye");
        res.redirect("/listings");
    })
})
module.exports = router;