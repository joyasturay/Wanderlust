const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");
const Expresserror=require("./utils/Expresserror.js");
const listings=require("./routes/listings.js");
const reviews=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");
var methodOverride = require('method-override');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
const expressSession={
  secret:"keyboard cat",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    httpOnly:true,
  }
};
app.use(session(expressSession));
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
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
  res.render("./listings/home.ejs");
});
app.all("*",(req,res,next)=>{
    next(new Expresserror(404,"Page not found"));
});
app.use((err,req,res,next)=>{
   let {statusCode=500,message="Something went wrong"}=err;
   res.status(statusCode).render("./listings/error.ejs",{err});
});

app.listen(8080,()=>{
    console.log("server is running on port 8080");
})