var MongoClient = require('mongodb').MongoClient,
  test = require('assert'),
  config = require('../config');

MongoClient.connect(config.mongodb.url, function (err, db) {
  test.equal(null, err);
  var admin = {
    account: 'voramelon',
    pass: 'voramelon',
    nickname: 'L.Pll513',
    avatar: '',
    intro: '',
    time: new Date()
  };
  db.collection('admin').insertOne(admin, function(err, r) {
    test.equal(null, err);
    test.equal(1, r.insertedCount);
    db.close();
  });
});