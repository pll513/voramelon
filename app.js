var express = require('express'),
  logger = require('morgan'),
  Pool = require('generic-pool').Pool,
  MongoClient = require('mongodb').MongoClient,
  admin = require('./routes/admin'),
  config = require('./config'),
  mongoUrl = config.mongodb.url,
  timetoString = require('./utils/time_to_string'),
  pool,
  server,
  app,
  multer = require('multer'),
  uuidV1 = require('uuid/v1'),
  storage;

storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/public/images');
  },
  filename: function (req, file, cb) {
    var fileParted = file.originalname.split('.');
    var fileExt = fileParted[fileParted.length - 1];
    cb(null, uuidV1() + '.' + fileExt);
  }
});

upload = multer({
  storage: storage
});

// pool = new Pool({
//   name: 'mongodb',
//   create: function(callback) {
//     MongoClient.connect(config.mongodb.url, {
//       server:{poolSize:1}
//     }, function(err,db){
//       callback(err,db);
//     });
//   },
//   destory: function (db) {
//     db.close();
//   },
//   max: 10,
//   min: 0,
//   idleTimeoutMillis : 30000
// });

app = express();

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));


// app.use('admin/drafts')
app.use(logger('dev'));

app.use('/users', express.static('users'));
app.use('/', express.static('public'));
app.use('/admin', admin);


app.get('/', function (req, res) {
  res.render('index.jade');
});
app.get(/^\/blogs\/([\w-]+)\/?$/, function (req, res) {
  
  var uri = req.params[0];
  
  console.log(uri);
  MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
    
    db.collection('blogs', function (err, col) {
      
      col.findOne({uri: uri}, {'_id': 0, 'markdown': 0}, function (err, result) {
        
        if (!result) {
          return res.render('error');
        }
        
        result.time = timetoString(new Date(result.time));
        
        db.close(true);
        res.render('article.jade', {blog: result});
        
      });
      
    })
    
  });
  
});



var server = app.listen(3000, function () {});
