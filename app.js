const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./models'); // import Sequelize
const indexRouter = require('./routes/index'); //import routes from index.js

const app = express();


sequelize.authenticate();
sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter); 


// Test the connection to the database.
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (err) {
    console.error('Error connecting to the database: ', err);
  }
})();

// catch 404 and forward to global error handler
app.use((req, res, next) => {
  const err = new Error();
  err.message = 'It looks like that page does not exist.'
  err.status = 404;
  next(err);
});

// global error handler
app.use((err, req, res, next) => {

  if (err.status === 404) {
    res.status(err.status).render('page-not-found', { err });
  } else {
    err.message = err.message || "There's an issue on the server side. Please try again later.";
    res.status(err.status || 500).render('error', { err } );
  }
});


module.exports = app;