const User=require("../models/user");
module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup");
}

module.exports.Signup = async(req,res)=>{
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
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.loginForm=async (req,res)=>{
    req.flash("success","welcome back");
    let redirecturl=res.locals.redirecturl || "/listings";
    res.redirect(redirecturl);
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            req.flash("error",err.message);
            return next(err);
        }
        req.flash("success","goodbye");
        res.redirect("/listings");
    })
}
