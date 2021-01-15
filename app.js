
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const pug = require('pug');
const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();
//static middleware
app.use('/static', express.static('./public'));


//
// STEP 5
//

const models = require('./models');

const {Book} = models;

(async () => {

  await models.sequelize.authenticate(console.log('db connected'));
  
  await models.sequelize.sync( {force: true});

  try{
    
  const dbInstances = await Promise.all([

    Book.create({
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      genre: "Computer Science",
      year: 2008,
    })


  ]);

  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
        // if the error is the above, map over the error items and returns an array holding error messages and log.
        const errors = error.errors.map((err ) => 
            err.message );
            console.error('Validation errors: ', errors);
    } else {
        //catch all other (unforeseen) errors
        throw error;
    }
  }
})();







// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
