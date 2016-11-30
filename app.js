var express = require('express');
var app = express();
app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use('/users', express.static('users'));

app.get('/', function (req, res) {
  res.render('index.jade');
});
app.get('/article', function (req, res) {
  res.render('article.jade');
});

var server = app.listen(3000, function () {});