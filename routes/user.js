const express = require('express')
const router = express.Router({mergeParams:true})

const User=require("../models/user.js")
const asyncWrap = require('../utility/asyncWrap.js')
const passport = require('passport')
const { saveRedirectUrl } = require('../middleware.js')


router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs")
})


router.post("/signup",asyncWrap(async(req,res)=>{
    try{let {username,email,password}=req.body;
        let newUser=new User({email,username})
        const registereduser=await User.register(newUser,password)
        console.log(registereduser)
        req.login(registereduser, (err)=>{
            if(err){
                next(err)
            }
            req.flash("success","User registered successfully")
            res.redirect("/listing")  
        })
    }catch(e){
            req.flash("error",e.message );
            res.redirect("/signup")
        }

}))


router.get("/login",(req,res)=>{
    res.render("user/login.ejs")
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),async (req,res)=>{
    let{username}=req.body;
    req.flash("success",`Welcome back ${username}`)
    let redirectUrl=res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl)
})


//logout


router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        };
        req.flash("success","Logged Out")
        res.redirect("/listing")
    });
})


module.exports=router