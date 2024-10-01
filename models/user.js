const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const passportLocalMongoose=require("passport-local-mongoose")

const userSchema=  new Schema({
    email:{
        type:String,
        requireed:true
    }
});

userSchema.plugin(passportLocalMongoose) //generate username and password

module.exports=mongoose.model("User",userSchema)