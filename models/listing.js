const mongoose = require('mongoose');
const{Schema}=mongoose;
let Review=require("./reviews")

//main().then((res)=>{
  //  console.log(res)
//})
//
//.catch(err => console.log(err));

//async function main() {
 // await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
//};
const def="https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        require:true,
    }
})







listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    });
    
const Listing=mongoose.model("Listing",listingSchema)
module.exports=Listing;