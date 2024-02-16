import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    name:{
        type:String,
        requied:true
    },
    description:{
        type:String,
        requied:true
    },
    address:{
        type:String,
        requied:true
    },
    regularPrice:{
        type:Number,
        requied:true
    },
    discountedPrice:{
        type:Number,
        requied:true
    },
    bathrooms:{
        type:Number,
        requied:true
    },
    bedrooms:{
        type:Number,
        requied:true
    },
    furnished:{
        type:Boolean,
        required:true
    },
    parking:{
        type:Boolean,
        default: true 
    },
    offer:{
        type:Boolean,
        required:true
    },
    imageUrls:{
        type:Array,
        required:true
    },
    userRef:{
        type:String,
        required:true
    }
},{timestamps:true})


const Listing = mongoose.model('Listing',listingSchema)

export default Listing


