const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Expresserror=require("../utils/Expresserror.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listings.js");
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(',');
        throw new Expresserror(400,errMsg);
    }else{
        next();
    }
};

//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
      res.render("./listings/index.ejs",{allListings});
  }));
  //New route
  router.get("/new",(req,res)=>{
      res.render("listings/new.ejs");
  });
  router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
       const newListing=new Listing(req.body);
          await newListing.save();
          req.flash("success","listing created successfully");
          res.redirect("/listings");
     
  }));
  //Show route
  router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
  const listing= await Listing.findById(id).populate("reviews");
  if(!listing){
    req.flash("error","listing not found");
     res.redirect("/listings");
  }
  res.render("./listings/show.ejs",{listing});
}));
//update route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","listing not found");
         res.redirect("/listings");
      }
    res.render("listings/edit.ejs",{listing});
}));
router.put("/:id",wrapAsync(async (req,res)=>{
    const {id}=req.params;
  const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success","listing updated successfully");
  res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");
}));

module.exports = router;