var express = require('express'),
  router = express.Router(),
  bodyParser = require('body-parser'),
  path = require('path'),
  multer = require('multer'),
  uuidV1 = require('uuid/v1'),
  MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  config = require('../config'),
  mongoUrl = config.mongodb.url,
  fs = require('fs'),
  storage,
  upload;

storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.path + '/public/images');
  },
  filename: function (req, file, cb) {
    var fileParted = file.originalname.split('.');
    var fileExt = fileParted[fileParted.length - 1];
    cb(null, uuidV1() + '.' + fileExt);
  }
});

upload = multer({
  storage: storage
}).single('draft-img');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// router.use('/drafts', upload.single('draft-img'), function(req, res, next) {
//   console.log(req.file);
//   next();
// });

router.get('/', function (req, res) {
  res.render('admin/admin');
});

router.get('/login', function (req, res) {
  res.render('admin/login');
});

router.get('/blogs', function (req, res) {
  res.render('admin/blogs');
});

router.get('/drafts', function (req, res) {
  res.render('admin/drafts');
});

router.get('/editor', function (req, res) {
  res.render('admin/editor');
});

router.get('/info', function (req, res) {
  res.render('admin/info');
});

router.get('/settings', function (req, res) {
  res.render('admin/settings');
});

router.post('/blogs', function (req, res) {
  // var draft = req.bo
});

router.post('/drafts', function (req, res) {
  
  upload(req, res, function(err) {
    assert.equal(null, err);
    var draft;
    draft = req.body;
    draft.img = '/images/' + req.file.filename;
    console.log(draft);
    MongoClient.connect(mongoUrl, {
      server:{poolSize:1}
    }, function (err, db) {
      assert.equal(null, err);
      db.collection('drafts').insertOne(draft, function (err, result) {
        assert.equal(null, err);
        assert.equal(1, result.insertedCount);
        db.close();
      });
    })
  });
  res.send("hahaha");
});

router.put('/blogs', function (req, res) {
  
});

router.put('/drafts', function (req, res) {
  
});

router.delete('/blogs', function (req, res) {
  
});

router.delete('/drafts', function (req, res) {
  
});

module.exports = router;