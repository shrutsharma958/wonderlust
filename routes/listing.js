const express = require('express')
const router = express.Router({mergeParams:true})
const asyncWrap=require("../utility/asyncWrap.js")
const Review = require("../models/reviews.js")

const Listing=require("../models/listing.js")
const expresserror=require("../utility/expresserror.js")
const {isLoggedIn}=require("../middleware.js")
const passport = require('passport')
const localStrategy=require("passport-local")
const passportLocalMongoose=require("passport-local-mongoose")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })


//new route
router.get("/new",isLoggedIn,(req,res)=>{
 
    res.render("listings/new.ejs")
})


//new listing route 
 router.post("/",upload.single("image"),asyncWrap( async (req,res,next)=>{
   let {title,description,image,price,location,country}=req.body;
    let listing1=new Listing({title,description,image,price,location,country})
    
    let url=req.file.path;
    let filename=req.file.filename;
    listing1.image={url,filename}
    listing1.owner=req.user._id;
    await listing1.save().then((res)=>{
      console.log(res)
    })
   req.flash("success","New Listing Registered")
     
     res.redirect("/listing")

})
);



//index route
router.get("/", asyncWrap(async (req,res,next)=>{
    const allListing = await Listing.find({})
    res.render("listings/listing.ejs",{allListing})
    
    
}))

  




//read route
router.get("/:id",asyncWrap(async (req,res,next)=>{
    let {id}=req.params;
    let list=  await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path:"author",
        },
    })
    .populate("owner");
    if(!list){
        req.flash("error","Listing does not exists")
        res.redirect("/listing")
    }
    res.render("listings/read.ejs",{list})
}))


//edit route
router.get("/:id/edit",isLoggedIn, asyncWrap(async (req,res,next)=>{
    let {id}=req.params;
    let list=  await Listing.findById(id)
    res.render("listings/edit.ejs",{list})
}))



// listing delete route 
router.delete("/:id",isLoggedIn,asyncWrap(async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findByIdAndDelete(id)
    console.log(listing)
    req.flash("success"," Listing Deleted")
    res.redirect("/listing")
}))



//update route 

router.post("/:id",asyncWrap( async (req,res,next)=>{
    let {id}=req.params;
    let list=   Listing.findById(id)
    let {title,description,image,price,location,country}=req.body;
    console.log({title,description,image,price,location,country})
    await Listing.findByIdAndUpdate(id,{title,description,image,price,location,country})
    req.flash("success","Listing Updated!")
    res.redirect(`/listing/${id}`)
}))

module.exports=router;