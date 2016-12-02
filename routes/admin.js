var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('admin-login');
});

router.get('/dashboard', function (req, res) {
  res.render('admin-dashboard');
});

router.get('/write-blog', function (req, res) {
  res.render('admin-write-blog');
});

router.get('/drafts', function (req, res) {
  res.render('admin-blog-drafts');
});

router.get('/published', function (req, res) {
  res.render('admin-blog-published');
});

router.get('/blog', function (req, res) {
  res.render('admin-blog');
});

module.exports = router;