const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({

    bookId: {type: mongoose.Schema.Types.ObjectId, ref: 'bookDB',required:true,trim:true},
    reviewedBy: {type:String,required:true, default:'Guest',trim:true},
    reviewedAt: {type:Date,default: null,trim:true},
    rating: {type:Number, required:true,trim:true},
    review: {type:String,trim:true},
    isDeleted:{ type:Boolean, default:false}
}, { timestamps: true })

module.exports = mongoose.model('reviewDB', reviewSchema)