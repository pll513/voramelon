var timeToString = function (time) {
  
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

module.exports = timeToString;