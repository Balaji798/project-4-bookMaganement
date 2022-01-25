const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({

    title:{ type:String, require:true, unique:true,trim:true},

    excerpt:{ type:String, require:true,trim:true},

    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'writerDB',require:true,trim:true},

    ISBN:{ type:String, required:true,unique:true,trim:true},

    category:{ type:String, require:true,trim:true},

    subCategory:{ type:String, require:true,trim:true},

    reviews:{ type:Number, default:0,trim:true},

    deletedAt:{ type: Date, default: null},

    isDeleted:{ type:Boolean, default:false},

    releasedAt:{ type:String, default:null},

}, { timestamps: true })

module.exports = mongoose.model('bookDB', bookSchema)