const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const reviewModal=require('../model/reviewModel')
const bookModal=require('../model/bookModel')

const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true;
}
const isValidRequestBody = function (writer) {
  return Object.keys(writer).length > 0
}
const isValidObjectId = function(objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
}
const reviewData =async function (req, res){
try{
    const parems =req.params.bookId
    const review = req.body
    if (!isValidRequestBody(review)) {
      res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide reviewer details' });
      return;
    }
    const bookId = review.bookId
    let book= 0
    if(parems==bookId){
     book = await bookModal.findOne({_id:bookId})
    }
    if(book.length==0){
        return res.status(404).send({status:false,message:'book dose not exist'});
    }
    if(book.isDeleted===false){
    const {reviewedBy,rating}=review;
    if (!isValid(bookId)) {
        res.status(400).send({ status: false, message: 'bookId  is required' });
        return;
      }
    if (!isValid( reviewedBy)) {
        res.status(400).send({ status: false, message: 'reviewedBy  is required' });
        return;
      }
    
    if (!isValid(rating)) {
        res.status(400).send({ status: false, message: 'rating  is required' });
        return;
      }
    if (!(rating >= 1 && rating <= 5)) {

        return res.status(400).send({ status: false, messege: "Rating Value Should Be In Between 1 to 5" })

    }
    const reviewedAt=new Date();
    let reviewData={bookId,reviewedBy,reviewedAt,rating};
    reviewData = await reviewModal.create(reviewData)
    let checker = await reviewModal.find({bookId:bookId,isDeleted:false});

            let number = checker.length



             await bookModal.findOneAndUpdate({_id:bookId,isDeleted:false},{reviews:number})
    res.status(201).send({status:true,message: 'Success',data:reviewData})
  }else{
    res.status(404).send({status:false,message:"book dose not exist"})
  }
}catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
   
} 
const reviewDelete = async function (req, res) {
  try {
    const reviewId = req.params.reviewId
    if (!isValidObjectId(reviewId)) {
      res.status(404).send({ status: false, message: `${ reviewId} is not a valid review id` })
      return
    }
    if (!isValid(reviewId)) {
      return res.status(400).send({ messege: "Please Provide The review id" })
    }

     
    const bookID = req.params.bookId
    if (!isValidObjectId(bookID)) {
      res.status(404).send({ status: false, message: `${bookId} is not a valid book id` })
      return
    }
    if (!isValid(bookID)) {
      return res.status(400).send({ messege: "Please Provide The bookId" })
    }
    
   
    let findbook = await bookModal.findOne({ _id: bookID })
    if (!findbook) {
      return res.status(400).send({ message: "Currently Their Is No bOOK" })
    }
    const reviewNew = await reviewModal.findOneAndUpdate({ _id: reviewId ,isDeleted:false},{isDeleted:true},{ new: true })  
  
    if (reviewNew) {
      
     
       res.status(200).send({ staus: true,message:"review has been deleted"})
    }
    else {
      return res.status(404).send({ msg: "Review Has Been Already Deleted" })
    }
  }
  catch (error) {
  return res.status(500).send({ status: false, message: error.message });
}
}
const updateReview = async function (req, res) {
  try {
      let body = req.body
      let bookId = req.params.bookId
      let reviewId = req.params.reviewId
      if (!(isValid(bookId && reviewId))) {
          return res.status(404).send({ messege: "Please provide The Id Properly" })
      }
      if (!isValidRequestBody(body)) {
          return res.status(400).send({ messege: "Please Provide The Required Field" })
      }
      if (!isValidObjectId(bookId)) {
          res.status(400).send({ status: false, message: 'You Are Providing Invalid bookId' });
          return;
      }
      if (!isValidObjectId(reviewId)) {
          res.status(400).send({ status: false, message: 'You Are Providing Invalid reviewId' });
          return;
      }
      const { reviewedBy, review, rating } = body
      if (reviewedBy) {
          if (!isValid(reviewedBy)) {
              return res.status(404).send({ messege: "Please provide The Name" })
          }
      }
      if (review) {
          if (!isValid(review)) {
              return res.status(404).send({ messege: "Please Provide Your Review" })
          }
      }
      if (rating) {
          if (!isValid(rating)) {
              return res.status(404).send({ messege: "Please Provide Your Rating" })
          }
          if (!(rating >= 1 && rating <= 5)) {
              return res.status(400).send({ status: false, messege: "Rating Value Should Be In Between 1 to 5" })
          }
      }
      let find = await bookModal.findOne({ _id: bookId, isDeleted: false })
      if (!find) {
          return res.status(400).send({ messege: "The Book Doesn't Exist In Our Data" })
      }
      let check = await reviewModal.findOne({ _id: reviewId, isDeleted: false })
      if (!check) {
          return res.status(400).send({ status: false, messege: "The Review Data Doesn't Exist" })
      }
      if (find && check) {
          let equal = check.bookId
          if (equal == bookId) {
              const updatedReview = await reviewModal.findOneAndUpdate({ _id: reviewId }, { reviewedBy: reviewedBy, review: review, rating: rating }, { new: true }).select({ __v: 0 })
              return res.status(200).send({ status: true, message: 'Review updated successfully', data: updatedReview });
          }
          else {
              return res.status(400).send({ status: false, messege: "You Are Not Allowed To Update This" })
          }
      } else {
          return res.status(400).send({ status: false, messege: "Cant Find What You Are Looking For" })
      }
  } catch (error) {
      res.status(500).send({ status: false, message: error.message });
  }
}
module.exports.reviewData = reviewData
module.exports.reviewDelete=reviewDelete
module.exports.updateReview=updateReview