const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./models'); // import Sequelize
const indexRouter = require('./routes/index');

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

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error(`We have trouble finding the page you requested.`);
  err.status = 404;
  next(err)
});

// error handler
app.use((err, req, res) => {
  if(err.status) {
    if(err.status === 404) {
      res.render('page-not-found', {err});
    } else {
      res.render('error', {err});
    }
  } else {
    err.message = "There's an issue on the server side. Please try again later."
    err.status = 500;
    console.log(err.status, err.message);
    res.render('error', {err});
  }

});

module.exports = app;