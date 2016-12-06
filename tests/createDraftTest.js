var MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  config = require('../config');

MongoClient.connect(config.mongodb.url, function (err, db) {
  assert.equal(null, err);
  var draftArr = [
    {
      uri: 'my-fisrt-blog',
      title: '博客一的主题',
      desc: '博客一的描述描述描述描述描述描述描述描述描述描述描述描述',
      markdown: '博客一的markdown代码markdown代码markdown代码markdown代码markdown代码markdown代码markdown代码markdown代码markdown代码',
      html: '博客一的html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码',
      type: '数学',
      img: '/images/11111111-baa1-11e6-aba1-5940e1e4bac4.jpg',
      time: new Date().getTime()
    },
    {
      uri: 'my-second-blog',
      title: '博客二的主题',
      desc: '博客二的描述描述描述描述描述描述描述描述描述描述描述描述',
      markdown: '博客二的markdown代码markdown代码markdown代码markdown代码markdown代码markdown代码markdown代码markdown代码markdown代码',
      html: '博客二的html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码',
      type: '美术',
      img: '/images/22222222-baa1-11e6-aba1-5940e1e4bac4.jpg',
      time: new Date().getTime()
    },
    {
      uri: 'my-third-blog',
      title: '博客三的主题',
      desc: '博客三的描述描述描述描述描述描述描述描述描述描述描述描述',
      markdown: '博客三的markdown代码markdown代码markdown代码markdown代码markdown代码markdown代码markdown代码markdown代码markdown代码',
      html: '博客三的html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码html代码',
      type: '前端',
      img: '/images/33333333-baa1-11e6-aba1-5940e1e4bac4.jpg',
      time: new Date().getTime()
    }
  ];
  db.collection('drafts').insertMany(draftArr, function (err, r) {
    assert.equal(null, err);
    assert.equal(draftArr.length, r.insertedCount);
    db.close();
  });
});