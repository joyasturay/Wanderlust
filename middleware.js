module.exports.loggedin=(req,res,next)=>{
   console.log(req.user);
    if(!req.isAuthenticated()){
      req.session.redirecturl=req.originalUrl;
        req.flash("error","you must be logged in");
        res.redirect("/login");
      }
      next();
}
module.exports.saveredirecturl=(req,res,next)=>{
  if(req.session.redirecturl){
    res.locals.redirecturl=req.session.redirecturl;
  }
  next();
}