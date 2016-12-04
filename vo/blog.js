/**
 *
 * @param {String} uri 博客标识符
 * @param {String} title 博客标题
 * @param {String} desc 博客描述
 * @param {String} html 博客主体
 * @param {String} type 博客分类
 * @param {String} img 博客图片地址
 * @param {Number} readCnt 阅读数量
 * @param {Number} commentCnt 评论数量
 * @param {Number} likeCnt 喜欢数量
 * @param {Date} time 发表日期
 * @constructor
 */
var Blog = function(uri, title, desc, html, type, img, readCnt, commentCnt, likeCnt, time) {
  this.uri = uri;
  this.title = title;
  this.desc = desc;
  this.html = html;
  this.type = type;
  this.img = img;
  this.readCnt = readCnt || 0;
  this.commentCnt = commentCnt || 0;
  this.likeCnt = likeCnt || 0;
  this.time = time;
};

module.exports = Blog;