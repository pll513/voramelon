var express = require('express');
var app = express();
var logger = require('morgan');
var admin = require('./routes/admin');

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use('/users', express.static('users'));
app.use('/admin', admin);

app.use(logger('dev'));

app.get('/', function (req, res) {
  res.render('index.jade');
});
app.get('/article', function (req, res) {
  res.render('article.jade');
});

var server = app.listen(3000, function () {});