const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Expresserror=require("../utils/Expresserror.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listings.js");
const loggedin=require("../middleware.js").loggedin;
const isOwner=require("../middleware.js").isOwner;
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({  storage });
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(',');
        throw new Expresserror(400,errMsg);
    }else{
        next();
    }
}
router.get("/search",wrapAsync(async (req, res) => {
    
        const searchQuery = req.query.title;
        const searchResults = await Listing.find({ title: { $regex: searchQuery, $options: "i" } });
        res.render("listings/search.ejs", { searchResults }); // Render the search results in search.ejs
}));

router.route("/")
//index route
.get(wrapAsync(listingController.index))
//show route
.post(loggedin,upload.single("image"),validateListing,wrapAsync(listingController.createListing));








//New route
router.get("/new",loggedin,listingController.newForm);

router.route("/:id").get(wrapAsync(listingController.showListing))
.put(loggedin,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updateListing))
.delete(loggedin,isOwner,wrapAsync(listingController.destroyListing));

//update route
router.get("/:id/edit",loggedin,isOwner,wrapAsync(listingController.renderEditForm));




module.exports = router;