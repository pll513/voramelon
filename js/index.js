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