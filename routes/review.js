const express = require('express')
const router = express.Router({mergeParams:true})

const asyncWrap=require("../utility/asyncWrap.js")
const expresserror=require("../utility/expresserror.js")
const Review = require("../models/reviews.js")
const Listing=require("../models/listing.js")
const { isLoggedIn, isAuthor } = require('../middleware.js')


//review delete route

router.delete("/:reviewid",isLoggedIn,isAuthor,asyncWrap(async (req,res)=>{
    let {id,reviewid}=req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})

    await Review.findByIdAndDelete(reviewid)
    req.flash("success"," Review Deleted")
    res.redirect(`/listing/${id}`)
}))












//review route
router.post("/",isLoggedIn,asyncWrap(async (req,res)=>{
    let newreview=new Review(req.body.review);
    let {id}=req.params;
    let listing = await Listing.findById(id)

     newreview.author=req.user._id;
    await  listing.reviews.push(newreview)
   await newreview.save()
   await listing.save()
   req.flash("success","New Review Added")
   res.redirect(`/listing/${id}`)
}))

module.exports=router