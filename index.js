const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listings.js");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const Expresserror=require("./utils/Expresserror.js");
const {listingSchema}=require("./schema.js");
const Review=require("./models/review.js");
const {reviewSchema}=require("./schema.js");
var methodOverride = require('method-override');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(',');
        throw new Expresserror(400,errMsg);
    }else{
        next();
    }
};
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(',');
        throw new Expresserror(400,errMsg);
    }else{
        next();
    }
};
const Mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to mongodb")
})
.catch(err =>{
     console.log(err)
});

async function main() {
  await mongoose.connect(Mongo_url);
}
app.get("/",(req,res)=>{
    res.send("Hello World");
});

//index route
app.get("/listings",wrapAsync(async (req,res)=>{
  const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));
//create route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
     const newListing=new Listing(req.body);
        await newListing.save();
        res.redirect("/listings");
   
}));
//update route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
app.put("/listings/:id",wrapAsync(async (req,res)=>{
    const {id}=req.params;
  await  Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
//Review
app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
})
);
//Delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));
//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
  const listing= await Listing.findById(id).populate("reviews");
  res.render("./listings/show.ejs",{listing});
}));
app.all("*",(req,res,next)=>{
    next(new Expresserror(404,"Page not found"));
});
app.use((err,req,res,next)=>{
   let {statusCode=500,message="Something went wrong"}=err;
   res.status(statusCode).render("./listings/error.ejs",{err});
   //res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is running on port 8080");
})