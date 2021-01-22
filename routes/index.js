const express = require('express');
const router = express.Router();

const {sequelize, Book } = require('../models');
const {Op} = require('sequelize');

let searchString = "";

// Handler function to wrap each route
function asyncHandler(cb){
  return async(req,res,next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // forward error to the global error Handler
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books');
});


/* GET books listing. */
router.get('/books', asyncHandler(async(req, res, next) => {
  if(searchString === ""){
    const books = await Book.findAll({
      offset: 0,
      limit: 10
    });
  res.render('index', {books});
  } else {
    const books = await Book.findAll({
      where: {
        [Op.or]:[
          {title: {[Op.like]: `%${searchValue}%`}},
          {author: {[Op.like]: `%${searchValue}%`}},
          {genre: {[Op.like]: `%${searchValue}%`}},
          {year: {[Op.like]: `%${searchValue}%`}},
        ]
      },
      offset: 0,
      limit: 10
    })
    res.render('index', {books});
  }
}));

//Search Route

router.post('/books', asyncHandler(async(req, res, next) => {
  
    const books = await Book.findAll({
      where: {
        [Op.or]:[
          {title: {[Op.like]: `%${req.body.query}%`}},
          {author: {[Op.like]: `%${req.body.query}%`}},
          {genre: {[Op.like]: `%${req.body.query}%`}},
          {year: {[Op.like]: `%${req.body.query}%`}},
        ]
      },
      offset: 0,
      limit: 10
    })
    searchValue = req.body.query;
    res.render('index', {books});
  }
));


/* Create a new book form */
router.get('/books/new', (req,res) => {
  res.render('new-book');
});

/* POST a newly created book. */
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/')
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('form-error', { book, errors: error.errors})
    } else {
      throw error;
    }
  }
}));

/* UPDATE a single book */
router.get('/books/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', { id: req.params.id, book})
  
  }));

/* POST an updated book. */
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/books/');
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    if(err.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', { book, errors: err.errors})
    } else {
      throw err;
    }
  }
}));

// /* Delete single book. */
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/');
  } else {
    res.sendStatus(404);
  }
}));






module.exports = router;