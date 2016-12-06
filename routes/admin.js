var express = require('express'),
  router = express.Router(),
  bodyParser = require('body-parser'),
  path = require('path'),
  multer = require('multer'),
  uuidV1 = require('uuid/v1'),
  MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  markdown = require('markdown').markdown,
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
}).single('img');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

// router.use('/drafts', upload.single('draft-img'), function(req, res, next) {
//   console.log(req.file);
//   next();
// });

router.get('/', function (req, res) {
  res.render('admin/admin');
});

router.get('/login/', function (req, res) {
  res.render('admin/login');
});

router.get(/^\/drafts\/([\w-]+)[?&=]*$/, function (req, res) {
  
  var draftUri = req.params[0];
  
  MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
    assert.equal(null, err);
    db.collection('drafts').findOne({uri: draftUri}, {'_id': 0, 'markdown': 0}, function (err, result) {
      
      db.close();
      assert.equal(null, err);
      if (result == null) {
        return res.render('admin/error');
      }
      if (req.xhr) {
        res.json(result)
      } else {
        res.render('admin/article-draft', {draft: result});
      }
      
    });
  });
  
});

router.get('/drafts/', function (req, res) {
  
  MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
    
    db.collection('drafts').find({}, {
      '_id': 0,
      'uri': 1,
      'time': 1,
      'title': 1,
      'type': 1
    }).toArray(function (err, result) {
      
      var draftArr = result ? result : [];
      
      db.close();
      
      if (req.xhr) {
        res.json(draftArr);
      } else {
        res.render('admin/drafts', {draftArr: draftArr});
      }
      
    });
  });
  
});

router.get('/blogs/', function (req, res) {
  
  MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
    
    db.collection('blogs').find({}, {
      '_id': 0,
      'uri': 1,
      'time': 1,
      'title': 1,
      'type': 1,
    }).toArray(function (err, result) {
      
      var blogArr = result ? result : [];
      
      db.close();
      
      if (req.xhr) {
        res.json(blogArr);
      } else {
        res.render('admin/blogs', {blogArr: blogArr});
      }
      
    });
  });
});

router.get(/^\/blogs\/([\w-]+)\/?[?&=]*$/, function (req, res) {
  
  var uri = req.params[0];
  
  MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
    
    db.collection('blogs').findOne({uri: uri}, {'_id': 0}, function (err, result) {
      
      if (result == null) {
        db.close(true);
        return res.render('admin/error', {msg: "数据库查询失败"});
      }
      res.render('admin/article-blog', {blog: result});
      db.close(true);
      
    });
    
  });
  
});

router.get('/editor/', function (req, res) {
  
  var option = req.query.option || 'create',
    uri = req.query.uri || '',
    info = {
      option: option,
      uri: uri
    };
  console.log(uri);
  console.log(option);
  
  if (option == 'edit') {
    
    MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
      
      db.collection('drafts', function (err, col) {
        
        col.findOne({uri: uri}, {'_id': 0, 'html': 0}, function (err, result) {
          
          if (result == null) {
            db.close(true);
            return res.redirect('/admin/drafts/');
          }
          db.close(true);
          info.draft = result;
          res.render('admin/editor', {info: info});
        })
        
      })
      
    });
    
  } else {
    
    info.draft = {};
    res.render('admin/editor', {info: info});
    
  }
  
});

router.get('/info/', function (req, res) {
  res.render('admin/info');
});

router.get('/settings/', function (req, res) {
  res.render('admin/settings');
});

router.post('/drafts/', function (req, res) {
  
  var draft = {},
    reqBody = req.body;
  
  
  upload(req, res, function (err) {
    
    assert.equal(null, err);
    
    reqBody = req.body;
    draft.uri = reqBody.uri;
    draft.title = reqBody.title;
    draft.desc = reqBody.desc;
    draft.type = reqBody.type;
    draft.markdown = reqBody.markdown;
    draft.html = markdown.toHTML(draft.markdown);
    draft.time = new Date().getTime();
    if (req.file) {
      draft.img = '/images/' + req.file.filename;
    }
    
    MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
      
      db.collection('drafts').insertOne(draft, function (err, result) {
        
        assert.equal(null, err);
        assert.equal(1, result.insertedCount);
        db.close();
        res.redirect('/admin/drafts');
        
      });
      
    });
    
  });
  
});


router.post(/^\/drafts\/([\w-]+)\/?[?&=]*$/, function (req, res) {
  
  var draft = {},
    reqBody,
    uri = req.params[0];
  
  upload(req, res, function (err) {
    
    reqBody = req.body;
    
    if (reqBody.method == 'post') {
      
      draft.uri = reqBody.uri;
      draft.title = reqBody.title;
      draft.desc = reqBody.desc;
      draft.type = reqBody.type;
      draft.markdown = reqBody.markdown;
      draft.html = markdown.toHTML(draft.markdown);
      draft.img = '/images/' + req.file.filename;
      draft.time = new Date().getTime();
      
      MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
        
        db.collection('drafts').insertOne(draft, function (err, result) {
          
          db.close(true);
          res.redirect('/admin/drafts');
          
        });
        
      });
      
    } else if (reqBody.method == 'put') {
      
      draft.uri = reqBody.uri;
      draft.title = reqBody.title;
      draft.desc = reqBody.desc;
      draft.type = reqBody.type;
      draft.markdown = reqBody.markdown;
      draft.html = markdown.toHTML(draft.markdown);
      draft.time = new Date().getTime();
      if (req.file) {
        draft.img = '/images/' + req.file.filename;
      }
      
      MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
        
        db.collection('drafts').updateOne({uri: uri}, {$set: draft}, function (err, result) {
          
          assert.equal(null, err);
          db.close();
          res.redirect('/admin/drafts');
          
        });
      });
      
    } else {
      
      MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
        
        db.collection('drafts').deleteOne({uri: uri}, function (err, result) {
          
          assert.equal(null, err);
          db.close();
          res.redirect('/admin/drafts');
          
        });
        
      });
      
    }
    
  });
  
});

router.post(/^\/blogs\/([\w-]+)\/?[?&=]*$/, function (req, res) {
  
  var uri = req.params[0],
    method = req.body.method,
    blog = {};
  
  console.log('uri:' + uri);
  console.log('method:' + method);
  
  if (method == 'post') {
    
    MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
      
      db.collection('drafts').findOne({uri: uri}, {'_id': 0}, function (err, result) {
        
        if (result == null) {
          return res.render('admin/drafts', {msg: '数据库查询失败，请稍后再试'});
        }
        
        blog.title = result.title;
        blog.desc = result.desc;
        blog.type = result.type;
        blog.time = new Date().getTime();
        blog.markdown = result.markdown;
        blog.html = markdown.toHTML(result.markdown);
        blog.img = result.img;
        
        db.collection('blogs').findOne({uri: uri}, function (err, result) {
          
          if (result) {
            
            db.collection('blogs').updateOne({uri: uri}, {$set: blog}, function (err, result) {
              res.redirect('/admin/blogs');
              db.close(true);
            });
            
          } else {
  
            blog.uri = uri;
            blog.readCnt = 0;
            blog.likeCnt = 0;
            blog.commentCnt = 0;
            
            db.collection('blogs').insertOne(blog, function (err, result) {
              
              res.redirect('/admin/blogs');
              db.close(true);
              
            });
            
          }
          
        });
        
      });
      
    });
    
  } else if (method == 'put') {
    
    blog.uri = uri;
    blog.title = req.body.title;
    blog.desc = req.body.desc;
    blog.markdown = req.body.markdown;
    blog.html = markdown.toHTML(markdown);
    blog.type = req.body.type;
    blog.img = req.body.img;
    blog.readCnt = 0;
    blog.commentCnt = 0;
    blog.likeCnt = 0;
    blog.time = new Date().getTime();
    
    MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
      db.collection('blogs').updateOne({uri: uri}, {$set: blog}, {upsert: true}, function (err, result) {
        res.redirect('/admin/blogs');
        db.close();
      });
    });
    
  } else if (method == 'delete') {
    
    MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
      db.collection('blogs').deleteOne({uri: uri}, function (err, result) {
        res.redirect('/admin/blogs');
        db.close();
      });
    });
    
  } else {
    res.redirect('/admin/blogs');
  }
});

router.put(/^\/blogs\/([\w-]+)\/?[?&=]*$/, function (req, res) {
  
  var uri = req.params[0];
  MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
    assert.equal(null, err);
    db.collection('draft').findOne({uri: uri}, {'_id': 0}, function (err, result) {
      assert.equal(null, err);
      if (result == null) {
        return res.send('数据库查询失败，请稍后再试');
      }
      result.time = new Date().getTime();
      result.readCnt = 0;
      result.likeCnt = 0;
      result.commentCnt = 0;
      result.uri = uri;
      db.collection('blogs').updateOne(result, {upsert: true}, function (err, result) {
        assert.equal(null, err);
        db.close();
        res.render('admin/blogs');
      });
    });
  });
  
});

router.put('/drafts', function (req, res) {
  
  upload(req, res, function (err) {
    var draft;
    assert.equal(null, err);
    
  });
  
});

router.delete('/blogs', function (req, res) {
  
});

router.delete(/^\/drafts\/([\w-]+)\/?[?&=]*$/, function (req, res) {
  
  var uri = req.params[0];
  
  
  MongoClient.connect(mongoUrl, {server: {poolSize: 1}}, function (err, db) {
    
    db.collection('drafts').deleteOne({uri: uri}, function (err, result) {
      
      if (err) {
        console.log(err);
        db.close(true);
        return res.send({success:false});
      }
      
      db.close(true);
      if (result.deletedCount == 1) {
        res.send({success: true});
      } else {
        res.send({success: false});
      }
      
    });
    
  });
  
});

module.exports = router;