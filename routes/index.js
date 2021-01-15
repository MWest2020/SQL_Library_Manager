const express = require('express');
const router = express.Router();


//STEP 6
const Book = require('../models').Book

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(error){
      next(error);
    }
  }
}


/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  // console.log(books);
  res.render( books.map(book => book.toJSON()) );
  console.log(books);
}));


module.exports = router;
