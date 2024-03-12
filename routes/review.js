const express = require('express');
const router = express.Router({mergeParams:true});//read express docs it is used to pass the id to reviews folder
const {reviewSchema}=require("../schema.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Expresserror=require("../utils/Expresserror.js");
const Review=require("../models/review.js");
const Listing=require("../models/listings.js");
const loggedin=require("../middleware.js").loggedin;
const isReviewAuthor=require("../middleware.js").isReviewAuthor;
const reviewController=require("../controllers/reviews.js");
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(',');
        throw new Expresserror(400,errMsg);
    }else{
        next();
    }
};
//Create review
router.post("/",validateReview,loggedin,wrapAsync(reviewController.createReview));
//Delete review route
router.delete("/:reviewId",isReviewAuthor,loggedin,wrapAsync(reviewController.destroyReview));

module.exports = router;