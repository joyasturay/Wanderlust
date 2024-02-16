const Listing=require("./models/listings.js");
const Review=require("./models/review.js");
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
module.exports.isOwner=async (req,res,next)=>{
  let  {id}=req.params;
    let listing=await Listing.findById(id);
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you do not own this listing");
         return res.redirect(`/listings/${id}`);
      }
      next();
}
module.exports.isReviewAuthor=async (req,res,next)=>{
  let  {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(res.locals.currUser && !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review");
         return res.redirect(`/listings/${id}`);
      }
      next();
}