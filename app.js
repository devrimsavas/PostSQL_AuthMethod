
require('dotenv').config();
const db=require('./models');


db.sequelize.sync({force:false});


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

const session=require('express-session');

var app = express();

//add express-session 
app.use(session({
  secret:'your_secret_key',
  resave:false,
  saveUninitialized:true,
  cookie: {secure:false},
  maxAge: 24 * 60 * 60 * 1000
}));


//add a middleware if the user not logged in so that the username will be 'Guest'
app.use(function(req,res,next) {
  res.locals.username=(req.session.user && req.session.user.name) ? req.session.user.name : 'Guest';
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname+'/node_modules/bootstrap/dist'));
app.use(express.static(__dirname+'/node_modules/jquery/dist'));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);


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
