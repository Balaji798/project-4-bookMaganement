const mongoose = require('mongoose')
const moment =require('moment')
const bookModal=require('../model/bookModel')
const reviewModal = require('../model/reviewModel')
const writerModal = require('../model/writerModel')

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
const bookCreation = async function (req, res){
    try{
        const book = req.body;
       
        if (!isValidRequestBody(book)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide book details' });
            return;
          }
        const {title,excerpt,userId,ISBN,category,subCategory,review,deletedAt,isDeleted,releasedAt} = book
        const isIsbnAlreadyUsed = await bookModal.findOne({ ISBN:ISBN });
        if (isIsbnAlreadyUsed) {
            return res.status(403).send({ status: false, message: 'ISBN  already  exist' });
        }
        const isTitleAlreadyUsed = await bookModal.findOne({ title:title });
            if (isTitleAlreadyUsed) {
                return res.status(403).send({ status: false, message: 'title  already  exist' });
            }
        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'title is required' });
            return;
          }
          if (!isValid(excerpt)) {
            res.status(400).send({ status: false, message: 'excerpt is required' });
            return;
          }
          if (!isValid(userId)) {
            res.status(400).send({ status: false, message: 'userId is required' });
            return;
          }
          if(!isValidObjectId(userId)) {
            res.status(400).send({status: false, message: `${userId} is not a valid author id`})
            return
        }
          if (!isValid(ISBN)) {
            res.status(400).send({ status: false, message: 'ISBN is required' });
            return;
          }
          if (!isValid(category)) {
            res.status(400).send({ status: false, message: 'category is required' });
            return;
          }
          if (!isValid(subCategory)) {
            res.status(400).send({ status: false, message: 'subCategory is required' });
            return;
          }  
          if (req.userId._id == userId) {//

            let findid = await writerModal.findOne({ userId })

            if (findid) {

                book["releasedAt"] = moment().format("MMM Do YY");

                let savedBook = await bookModal.create(book);

                return res.status(201).send({ status: true, message: 'Success', data: savedBook });

            } else {

                return res.status(400).send({ status: false, messege: "Cant Find The Writer" });

            }

        } else {

            return res.status(400).send({ status: false, messege: "You are not authorised" });

        }
          
    } catch (error) {
     res.status(500).send({ status: false, message: error.message });
   }
}
const getBooks=async function (req, res){
  try{
    
    const filterQuery = {isDeleted: false}
        const queryParams = req.query
        if(isValidRequestBody(queryParams)) {
          const {userId, category, subcategory} = queryParams

          if(isValid(userId) && isValidObjectId(userId)) {
              filterQuery['userId'] = userId
          }

          if(isValid(category)) {
              filterQuery['category'] = category.trim()
          }

          if(isValid(subcategory)) {
              const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
              filterQuery['subcategory'] = {$all: subcatArr}
          }
      }

      const allBooks = await bookModal.find(filterQuery)
      allBooks.sort(function (a, b) {

        if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;

        if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;

        return 0;

    })
      if(Array.isArray(allBooks) && allBooks.length===0) {
          res.status(404).send({status: false, message: 'No book found'})
          return
      }

      res.status(200).send({status: true, message: 'Book list', data: allBooks})
  }catch (error) {
     res.status(500).send({ status: false, message: error.message });
   }
}
const getBooksById = async function (req, res){
  try{
    const param = req.params.bookId
    if(!isValidObjectId(param)) {
      res.status(400).send({status: false, message: `${param} is not a valid blog id`})
      return
  }
  
  let book = await bookModal.findOne({_id: param})
  let {title,bookCover,excerpt,userId,category,subcategory,deleted,reviews,deletedAt,releasedAt,createdAt,updatedAt}=book
  let reviewsData = await reviewModal.find({ bookId: book }).select({ createdAt: 0, updatedAt: 0, __v: 0 });
  const book1 ={title,bookCover,excerpt,userId,category,subcategory,deleted,reviews,deletedAt,releasedAt,createdAt,updatedAt,reviewsData}
  book1["reviews"]=book1["reviewsData"].length
   res.status(200).send({staus:true,data:book1})
  }catch (error) {
     res.status(500).send({ status: false, message: error.message });
   }
}
const updateBook = async function(req,res){
  try{
      const bookId = req.params.bookId
      let title = req.body.title
      let excerpt = req.body.excerpt
      let ISBN = req.body.ISBN
      let releasedate = req.body.releasedate
      if(!isValid(bookId)){
          return res.status(400).send({messege:"Please Provide The Book Id"})
      }
      if(!isValidRequestBody(req.body)){
          return res.status(400).send({messege:"Please Provide The Required Field"})
      }
      if(title){
      if(!isValid(title)){
          return res.status(400).send({messege:"Please Provide The Valid Title"})
      }
      const sametitle = await bookModal.findOne({ title: title.trim() });
      if (sametitle) {
          return res.status(403).send({ status: false, message: `${title} is already in used` });
      }}
      if(excerpt){
      if(!isValid(excerpt)){
          return res.status(400).send({messege:"Please Provide The Valid Excerpt"})
      }}
      if(ISBN){
      if(!isValid(ISBN)&&(ISBN.length==0)){
          return res.status(400).send({messege:"Please Provide The Valid ISBN"})
      }
      const SameISBN = await bookModal.findOne({ ISBN: ISBN.trim() });
      if (SameISBN) {
          return res.status(403).send({ status: false, message: `${ISBN} is already in used` });
      }}
      if(releasedate){
      if(!isValid(releasedate)){
          return res.status(400).send({messege:"Please Provide The Valid Date"})
      }}
      const check = await bookModal.findOne({ _id: bookId })
      const id = check.userId
      if (req.userId._id == id) {
        const updatedBook = await bookModal.findOneAndUpdate({ _id: bookId ,isDeleted:false}, { title: title, excerpt: excerpt,ISBN:ISBN, releasedAt:releasedate },{ new: true })
       return res.status(200).send({ status: true, message: 'Book updated successfully', data: updatedBook });
      } else {
       return res.status(404).send({ msg: "You Are Not Authorised To Update This" })
      }
  }catch (error) {
      return res.status(500).send({ status: false, message: error.message });
  }
}
const deleteBook = async function(req,res){
  try{
      const bookId = req.params.bookId
      if(!isValidObjectId(bookId)) {
        res.status(404).send({status: false, message: `${param} is not a valid book id`})
        return
    }
      if(!isValid(bookId)){
          return res.status(400).send({messege:"Please Provide The bookId"})
      }
      let findbook = await bookModal.findOne({_id:bookId})
      if(!findbook){
        return res.status(400).send({message:"Currently Their Is No bOOK"})
      }
      let id = findbook.userId
      if (req.userId._id == id) {
          let deletedbook = await bookModal.findOneAndUpdate({ _id: bookId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() },{new:true})
          if (deletedbook) {
           return res.status(200).send({ status:true,messege: "Book Deleted Successfully",data:deletedbook })
          }
          else {
           return res.status(404).send({ msg: "Book Has Been Already Deleted" })
          }
      }
  }catch (error) {
      return res.status(500).send({ status: false, message: error.message });
  }
}

module.exports.bookCreation = bookCreation
module.exports.getBooks = getBooks
module.exports.getBooksById = getBooksById
module.exports.updateBook=updateBook
module.exports.deleteBook=deleteBook
