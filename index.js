if(process.env.NODE_ENV!=='production'){
  require('dotenv').config()
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");
const Expresserror=require("./utils/Expresserror.js");
const listingRouter=require("./routes/listings.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const dbUrl=process.env.ATLASdb_url;
var methodOverride = require('method-override');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("Error in Mongo Session Store",err);
});
const expressSession={
  store:store,
  secret:process.env.SECRET,
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
main().then(() => {
    console.log("connected to mongodb")
})
.catch(err =>{
     console.log(err)
});

async function main() {
  await mongoose.connect(dbUrl);
}
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