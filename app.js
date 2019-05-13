var createError = require('http-errors');
var jade = require('jade');
var express = require('express');
var app = express();

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//导入mysq配置文件
const connection = require('./config/mysql');

app.get('/', function (req, res) {
  res.send('EduCat')
});
// 使用路由中间件，路由版本号v1
app.use('/api/v1', require('./routes/controllers/api_v1'))

// passport模块
const passport = require('passport');
app.use(passport.initialize());
require('./config/passport')(passport)
var jwt = require('jsonwebtoken');
var secretkey = 'secretkey';






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//创建一个connection连接
connection.connect(function (err) {
  if (err) {
    console.log('[query] - :' + err);
    return;
  }
  console.log('[connection connect]  succeed!'); //如果连接成功 控制台输出 success 了
});



module.exports = app;
