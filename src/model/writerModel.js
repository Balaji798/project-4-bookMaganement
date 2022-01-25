const mongoose = require('mongoose')

const writerSchema = new mongoose.Schema({

     title: {type:String,required:true, enum:['Mr', 'Mrs','Miss'],trim:true},
     name: {type:String,required:true,trim:true},
     phone: {
          type:String,
             unique:true,
             require:"mobile number is required",
             trim:true,
             validator:{
                 validator:function(mobile){
                     return  /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(mobile);
                 }, message: 'Please fill a valid mobile number', isAsync: false
             }
     },
     email: {
          type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            }, message: 'Please fill a valid email address', isAsync: false
        }, 
     }, 
     password: { type: String,required:true,trim: true},
     address: {
       street: {type:String,trim:true},
       city: {type:String,trim:true},
       pincode: {type:String,trim:true}
     }, 

}, { timestamps: true })

module.exports = mongoose.model('writerDB', writerSchema)