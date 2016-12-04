var MongoClient = require('mongodb').MongoClient,
  url = require('../config').mongodb.url,
  test = require('assert');

var BlogDAO = {
  createBlog: function (blog) {
    MongoClient.connect(url, function (err, db) {
      db.collection('blogs').insertOne(blog, function (err, result) {
        test.equal(null, err);
        db.close();
      });
    });
  },
  deleteBlog: function (uri) {
    MongoClient.connect(url, function (err, db) {
      db.collection('blogs').deleteOne({uri: uri}, function (err, result) {
        test.equal(null, err);
        test.equal(1, result.result.n);
        db.close();
      });
    });
  },
  updateBlog: function (blog) {
    MongoClient.connect(url, function (err, db) {
      db.collection('blogs').updateOne({uri: blog.uri}, blog, function (err, result) {
        test.equal(null, err);
        test.equal(1, result.result.n);
        db.close();
      });
    });
  },
  retrieveBlog: function (uri) {
    MongoClient.connect(url, function (err, db) {
      db.collection('blogs').findOne({uri: uri}, function (err, item) {
        test.equal(null, err);
        test.equal(uri, item.uri);
        db.close();
      });
    });
  }
};

module.exports = BlogDAO;