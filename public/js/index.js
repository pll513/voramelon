/**
 * 博客目录固定效果
 */

(function (win, doc, $) {
  var secBlog = $('#sec-blog');
  var secCategory = $('#sec-category');
  var window = $(win);
  var fixed = false;
  var secCategoryHeight;
  var secBlogOffsetTop;
  var windowScrollTop;
  var refresh = function () {
    secCategoryHeight = secCategory.outerHeight();
    secBlogOffsetTop = secBlog.offset().top;
  };
  var toggleFix = function () {
    windowScrollTop = window.scrollTop();
    
    // console.log('window' + windowScrollTop);
    // console.log('sec-category height' + secCategoryHeight);
    // console.log('sec-blog offset' + secBlogOffsetTop);
    
    if (windowScrollTop + secCategoryHeight >= secBlogOffsetTop) {
      if (!fixed) {
        secCategory.css({
          'position': 'fixed',
          'top': 0
        });
        secBlog.css({
          'margin-top': secCategoryHeight
        });
        secBlogOffsetTop = secBlog.offset().top;
        fixed = true;
      }
    } else if (fixed) {
      secCategory.css({
        'position': 'static'
      });
      secBlog.css({
        'margin-top': 0
      });
      secBlogOffsetTop = secBlog.offset().top;
      fixed = false;
    }
  };
  
  win.onresize = function () {
    refresh();
    toggleFix();
  };
  
  refresh();
  window.scroll(toggleFix);
})(window, document, $);


/**
 * 导航隐藏/显示
 */

(function (win, doc, $) {
  
  var headToggleDetail = $('#head-toggle-detail');
  // $('#nav-toggle').click(function () {
  //   headToggleDetail.toggleClass('none');
  // });
  $(doc.body).delegate('#nav-toggle', 'click', null, function (event) {
    headToggleDetail.toggleClass('none');
    event.stopPropagation();
  });
  $(doc.body).delegate(null, 'click', null, function (event) {
    headToggleDetail.addClass('none');
  });
  
})(window, document, $);


/**
 * 获取博客列表
 */

(function (win, doc, $) {
  
  var categoryTagList = doc.getElementById('category-tag-list'),
    timeToString,
    getBlogs,
    fresh,
    showMore;
  
  timeToString = function (time) {
    
    var currTime = new Date(),
      differ = (currTime - time) / 1000,
      minute,
      hour,
      day,
      result;
    
    if (Object.prototype.toString.call(time) !== '[object Date]') {
      // throw new Error('必须传入日期对象');
      return '';
    }
    
    if (differ < 0) {
      // throw new Error('日期非法');
      return '';
    }
    
    if (differ < 3600) {
      minute = Math.floor(differ / 60);
      result = minute + '分钟前';
    } else if (differ < 86400 /* 一天 */) {
      hour = Math.floor(differ / 3600);
      result = hour + '小时前';
    } else if (differ < 864000 /* 10天 */) {
      day = Math.floor(differ / 86400);
      result = day + '天前';
    } else {
      result = time.getYear() + '年' + time.getMonth() + '月' + time.getDate() + '日';
    }
    
    return result;
    
  };
  
  fresh = function (type) {
    var url = '/blogs/',
      query,
      blogItemListParent,
      ul,
      blogItemList = doc.getElementById('blog-item-list');
    
    
    blogItemListParent = $(blogItemList).parent();
    $(blogItemList).remove();
    ul = doc.createElement('ul');
    ul.setAttribute('id', 'blog-item-list');
    ul.setAttribute('class', 'blog-item-list mauto clearfix');
    
    if (type == 'all') {
      query = '';
    } else {
      query = '?type=' + type + '&page=' + '0';
    }
    $.ajax({
      url: url + query
    }).done(function (data) {
      
      var listItem,
        listItemLeft,
        listItemRight,
        listItemRightWrap,
        listItemImgWrap,
        listItemTop,
        listItemBottom,
        listItemTitle,
        listItemAuthor,
        listItemTime,
        listItemPipeOne,
        listItemPipeTwo,
        listItemReadCnt,
        listItemCommentCnt,
        listItemLikeCnt,
        a,
        img,
        i,
        len;
      
      for (i = 0, len = data.length; i < len && i <= 8; ++i) {
        
        listItem = doc.createElement('li');
        listItemLeft = doc.createElement('div');
        listItemRight = doc.createElement('div');
        listItemRightWrap = doc.createElement('div');
        listItemImgWrap = doc.createElement('a');
        listItemTop = doc.createElement('p');
        listItemBottom = doc.createElement('p');
        listItemTitle = doc.createElement('h4');
        listItemAuthor = doc.createElement('a');
        listItemTime = doc.createElement('span');
        listItemPipeOne = doc.createElement('span');
        listItemPipeTwo = doc.createElement('span');
        listItemReadCnt = doc.createElement('span');
        listItemCommentCnt = doc.createElement('span');
        listItemLikeCnt = doc.createElement('span');
        a = doc.createElement('a');
        img = doc.createElement('img');
        
        listItemImgWrap.setAttribute('class', 'list-item_img-wrap');
        img.setAttribute('src', data[i].img);
        img.setAttribute('class', 'list-item_img');
        listItemImgWrap.appendChild(img);
        listItemLeft.setAttribute('class', 'list-item_left');
        listItemLeft.appendChild(listItemImgWrap);
        
        listItemAuthor.setAttribute('class', 'list-item_author');
        listItemAuthor.innerHTML = "L.Pll513";
        // 缺少作者链接
        listItemTime.setAttribute('class', 'list-item_time');
        listItemTime.innerHTML = timeToString(new Date(data[i].time));
        listItemTop.setAttribute('class', 'list-item_top');
        listItemTop.appendChild(listItemAuthor);
        listItemTop.appendChild(listItemTime);
        
        listItemTitle.setAttribute('class', 'list-item_title');
        a.setAttribute('href', '/blogs/' + data[i].uri + '/');
        a.innerHTML = data[i].title;
        listItemTitle.appendChild(a);
        
        listItemReadCnt.setAttribute('class', 'list-item_read');
        listItemReadCnt.innerHTML = '阅读' + data[i].readCnt;
        listItemBottom.setAttribute('class', 'list-item_bottom');
        listItemBottom.appendChild(listItemReadCnt);
        listItemPipeOne.setAttribute('class', 'list-item_pipe');
        listItemPipeOne.innerHTML = '|';
        listItemBottom.appendChild(listItemPipeOne);
        listItemCommentCnt.setAttribute('class', 'list-item_comment');
        listItemCommentCnt.innerHTML = '评论' + data[i].commentCnt;
        listItemBottom.appendChild(listItemCommentCnt);
        listItemPipeTwo.setAttribute('class', 'list-item_pipe');
        listItemPipeTwo.innerHTML = '|';
        listItemBottom.appendChild(listItemPipeTwo);
        listItemLikeCnt.setAttribute('class', 'list-item_like');
        listItemLikeCnt.innerHTML = '喜欢' + data[i].likeCnt;
        listItemBottom.appendChild(listItemLikeCnt);
        
        listItemRight.setAttribute('class', 'list-item_right');
        listItemRight.appendChild(listItemTop);
        listItemRight.appendChild(listItemTitle);
        listItemRight.appendChild(listItemBottom);
        
        listItemRightWrap.setAttribute('class', 'list-item_right-wrap');
        listItemRightWrap.appendChild(listItemRight);
        
        listItem.setAttribute('class', 'list-item');
        listItem.appendChild(listItemLeft);
        listItem.appendChild(listItemRightWrap);
        
        ul.appendChild(listItem);
        
      }
      
      blogItemListParent.prepend(ul);
      
    });
  };
  
  showMore = function () {
    
  };
  
  $(categoryTagList).delegate('a', 'click', null, function (event) {
    event.preventDefault();
    console.log($(this));
    fresh($(this).text());
  });
  
})(window, document, $);