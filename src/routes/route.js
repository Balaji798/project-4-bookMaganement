const express = require('express');
const router = express.Router();

const writerController= require("../controllers/writerControllers.js")
const bookController= require("../controllers/bookControllers.js")
const reviewController= require("../controllers/reviewControllers.js")
const writerAuths = require("../middlewares/writerAuth.js")
const awsControllers = require("../controllers/awsControllers")



router.post("/writer/register", writerController.creatWriter)
router.post("/books", writerAuths.autherAuth,bookController.bookCreation)
router.post("/books/:bookId/review",reviewController.reviewData)
router.post("/login",writerController.loginWriter)
router.get("/books",bookController.getBooks)
router.get("/books/:bookId",bookController.getBooksById)
router.put("/books/:bookId",writerAuths.autherAuth,bookController.updateBook)
router.delete("/books/:bookId",writerAuths.autherAuth,bookController.deleteBook)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.reviewDelete)
router.post("/write-file-aws/",awsControllers.awsCreat)

module.exports = router;