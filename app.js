 if(process.env.NODE_ENV !="production"){
 require('dotenv').config()

 }
express = require('express')

const app = express()
const dbUrl=process.env.ATLASDB
const asyncWrap=require("./utility/asyncWrap.js")
const expresserror=require("./utility/expresserror.js")
const methodOverride=require("method-override")
const session=require("express-session")
const MongoStore = require('connect-mongo');

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"secret"
    },
    touchAfter:24 *3600,
});

store.on("error",()=>{
    console.log("Error in mongo session store",err)
})
const sessionOption ={
    store,
    secret:"secret",
    resave:false,
    saveUninitialized:true,
}
const flash=require("express-flash")
const passport = require("passport")
const localStrategy=require("passport-local")
const passportLocalMongoose=require("passport-local-mongoose")
const User=require("./models/user.js")



const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")
app.listen(8080,()=>{
    console.log("App Listening");
})
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}));
app.use(session(sessionOption))
app.use(flash());
const ejsmate = require('ejs-mate');
app.engine('ejs', ejsmate);


const mongoose = require('mongoose');

main().then((res)=>{
    console.log(res)
})

.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
};



app.use(passport.initialize())
app.use(passport.session())//to connect user with one session 
passport.use(new localStrategy(User.authenticate()))//tell passport about the strategy 
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})



app.use("/listing",listingRouter);
app.use("/listing/:id/review",reviewRouter)
app.use("/",userRouter)






//demo user
app.get("/demouser",async (req,res)=>{
 let fakeuser=new User({
    email:"student@gmai.com",
    username:"delta-student"
 })
 let reg=await User.register(fakeuser,"helloworld")
 console.log(reg)
})









//error handelers


app.use("*",(req,res)=>{
    throw new expresserror(404,"Page not found")
})

app.use((err,req,res,next)=>{
    let{status=401,message}=err
    console.log(err)
    res.render("error.ejs",{message})
})