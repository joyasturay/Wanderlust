const Listing=require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({});
      res.render("./listings/index.ejs",{allListings});
  }
  module.exports.newForm=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
  const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!listing){
    req.flash("error","listing not found");
     res.redirect("/listings");
  }
  res.render("./listings/show.ejs",{listing});
}
module.exports.createListing=async (req,res,next)=>{
  let response=await geocodingClient.forwardGeocode({
    query: req.body.location,
    limit: 1,
  })
    .send();
  let url=req.file.path;
  let filename=req.file.filename;
    const newListing=new Listing(req.body);
       newListing.owner=req.user._id;
       newListing.image={url,filename};
       newListing.geometry=response.body.features[0].geometry;
       await newListing.save();
       req.flash("success","listing created successfully");
       res.redirect("/listings");
  
}
module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","listing not found");
         res.redirect("/listings");
      }
      let originalImage=listing.image.url;
      originalImage= originalImage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImage});
}
module.exports.updateListing=async (req,res)=>{
    let  {id}=req.params;
let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
if(typeof req.file!="undefined"){//to check if there is any image file only then it will update
 let url=req.file.path;
 let filename=req.file.filename;
 listing.image={url,filename};
  await listing.save();
}
  req.flash("success","listing updated successfully");
  res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");
}