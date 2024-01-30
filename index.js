const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listings.js");
const ejsMate=require("ejs-mate");
var methodOverride = require('method-override');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

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
/*app.get("/testListings",async (req,res)=>{
    let sampleListing=new Listing({
        title:"My Villa",
        description:"By the beach",
        price:1200,
        location:"Calungute,Goa",
        country:"India",
    });
    await sampleListing.save();
    console.log("saved successfully");
    res.send("saved successfully");
});*/
//index route
app.get("/listings",async (req,res)=>{
  const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
app.post("/listings",async (req,res)=>{
    const newListing=new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
});
//update route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
app.put("/listings/:id",async (req,res)=>{
    const {id}=req.params;
  await  Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
});
//delete route
app.delete("/listings/:id",async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
//show route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
  const listing= await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
});

app.listen(8080,()=>{
    console.log("server is running on port 8080");
})