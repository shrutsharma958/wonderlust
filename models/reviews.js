const mongoose = require('mongoose');
const{Schema}=mongoose;
//main().then((res)=>{
  //  console.log(res)
//})

//.catch(err => console.log(err));

//async function main() {
  //await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
//};

const reviewSchema=new mongoose.Schema({
comment:String,
rating:{
    type:Number,
    min:1,
    max:5
},
createdAt:{
    type:Date,
    default:Date.now()
},
author:{
    type:Schema.Types.ObjectId,
    ref:"User"
},
})

const Review = mongoose.model("Review",reviewSchema);
module.exports=Review;