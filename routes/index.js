const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const { Op }  = require('sequelize');         //Needed for search operators

// Create ongoing variable to be updated by search route
let searchQuery = '';

// Handles asynchronous functions
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
}

// GET Home page and redirect
router.get('/', (req, res) => {
    res.redirect('/books/?page=0');
});


// Main route for page load and search query
router.get('/books', asyncHandler(async (req, res) => {
  if(searchQuery === '') {
    const {count, rows} = await Book.findAndCountAll({
      order: [['title', 'ASC']],
      offset: parseInt(req.query.page) * 10,
      limit: 10,
    });
    const pagination = count / 10;
    res.render('index', {count, rows, pagination});
  } else {
    const {count, rows} = await Book.findAndCountAll({ 
      
      where: {
        [Op.or]: [
          {title: {[Op.like]: `%${searchQuery}%`}},
          {author: {[Op.like]: `%${searchQuery}%`}},
          {publisher: {[Op.like]: `%${searchQuery}%`}},
          {genre: {[Op.like]: `%${searchQuery}%`}},
          {year: {[Op.like]: `%${searchQuery}%`}},
        ]
      },
      order: [["title", "ASC"]],
      offset: parseInt(req.query.page) * 10,
      limit: 10,
    });
    const pagination = count / 10;
    res.render('index', {count, rows, pagination});
  }
}));

// Search route
router.post('/books', asyncHandler(async (req, res) => {
  const {count, rows} = await Book.findAndCountAll({
    where: {
      [Op.or]: [
        {title: {[Op.like]: `%${req.body.query}%`}},
        {author: {[Op.like]: `%${req.body.query}%`}},
        {publisher: {[Op.like]: `%${req.body.query}%`}},
        {genre: {[Op.like]: `%${req.body.query}%`}},
        {year: {[Op.like]: `%${req.body.query}%`}},
      ]
    },
    order: [["title", "ASC"]],
    offset: parseInt(req.query.page) * 10,
    limit: 10,
  });
  const pagination = count / 10;
  searchQuery = req.body.query;
  res.render('index', {count, rows, pagination});
}));

// New book form page
router.get('/books/new', (req, res) => {
  res.render('new-book');
});

// New book submit
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect(`/books/?page=0`);
  } catch(error) {
    if(error.name === "SequelizeValidationError") { // checking the error type
      book = await Book.build(req.body);
      res.render("new-book", {book, errors: error.errors});
    } else {
      throw error;
    }
  }
}));

// Book Update and Delete Page
/* GET book detail page. */
router.get('/books/:id', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
  let book = null; //set to false

  for (let i = 0; i < books.length; i++) {
    if (books[i].id == req.params.id) {
      book = books[i]; //set to true (object are per definition true)
    }
  }

  if (!book) {
    
    const err = new Error();
    err.status = 404;
    err.message = 'Looks like the book you requested does not exist.';
    next(err);
  } else {
      console.log('reachable code');
      res.render("update-book", { book, title: 'Update Book' });
  }  
}));

/* POST update book page. */
router.post('/books/:id', asyncHandler(async(req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/books/?page=0');
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    if(err.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("update-book", { book, errors: err.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
}));

// Book Delete submit
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
    if(book) {
      await book.destroy();
      res.redirect('/books/?page=0');
    } else {
      res.sendStatus(404);
    }
}));


module.exports = router;