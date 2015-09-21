var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var os = require('os');
var _ = require('underscore');

var routes = require('./routes/index');
var users = require('./routes/users');
var Segment = require('node-segment').Segment;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.post('/annotate', upload.single('text'),function(req, res){
  var seg = new Segment();
  seg
  .use('URLTokenizer')            // URL识别
  .use('WildcardTokenizer')       // 通配符，必须在标点符号识别之前
  .use('PunctuationTokenizer')    // 标点符号识别
  .use('ForeignTokenizer')        // 外文字符、数字识别，必须在标点符号识别之后
  // 中文单词识别
  .use('DictTokenizer')           // 词典识别
  .use('ChsNameTokenizer')        // 人名识别，建议在词典识别之后

  // 优化模块
  .use('EmailOptimizer')          // 邮箱地址识别
  .use('ChsNameOptimizer')        // 人名识别优化
  .use('DictOptimizer')           // 词典识别优化
  .use('DatetimeOptimizer')       // 日期时间识别优化

  // 字典文件
  .loadDict('dict.txt')           // 盘古词典
  .loadDict('dict2.txt')          // 扩展词典（用于调整原盘古词典）
  .loadDict('names.txt')          // 常见名词、人名
  .loadDict('wildcard.txt', 'WILDCARD', true)   // 通配符
  var eol = new RegExp('\\r?\\n');
  var parsedText = req.file.buffer.toString('utf8').split(eol).map(function(t){
    return {segments: seg.doSegment(t)};
  });
  res.send({lines: parsedText});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
