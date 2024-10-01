const Review = require("./models/reviews");
const Listing= require("./models/listing");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){      
        req.session.redirectUrl=req.originalUrl;                                //login to add
        req.flash("error","You must be logged in to perform this action ")
       return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isAuthor=async (req,res,next)=>{
    let { id,reviewid }=req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You do not created this review ")
        return res.redirect(`/listing/${id}`);

    }
    next()
}