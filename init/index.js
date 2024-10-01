const mongoose = require('mongoose');

const sampleListings=require("./data.js");
const Listing=require("../models/listing.js")

main().then((res)=>{
    console.log(res)
})

.catch(err => console.log(err));

async function main() {

};

saveDb=async()=>{
 await Listing.deleteMany({})
 sampleListings.data=sampleListings.data.map((obj)=>({...obj,owner:"66f7e592e1b5ab0a1e05305e"}));
 await Listing.insertMany(sampleListings.data)
 console.log(sampleListings.data)
 console.log("Saved")
}
saveDb();