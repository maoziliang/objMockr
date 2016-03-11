var faker = require('faker');
var moment = require('moment');

/**
 * 随机生成true或者false
 * @param  {number}  probability 0~1之间的数，表示为true的概率
 * @return {Boolean}             true或者false
 */
exports.isTrue = function (probability) {
  return function () {
    return Math.random() > (1 - probability);
  };
};

/**
 * 随机生成[min, max]区间的整数
 * @param  {integer} min 最小数字
 * @param  {integer} max 最大数字
 * @return {integer}     随机整数
 */
exports.number = function (min, max) {
  max += 1;
  return function () {
    return Math.floor(Math.random() * (max - min) + min);
  };
};

/**
 * 随机生成小数
 * @param  {integer} [precision=2] 小数位精度
 * @return {number}           随机小数
 */
exports.decimal = function(precision) {
  precision = precision === undefined ? 2 : precision;
  return function () {
    return Number(Math.random().toFixed(precision));
  };
};

/**
 * 随机生成guid(eg. 16AEC7EC-06D4-4052-BBD1-2674ACACDD5B)
 * @return {string} Guid
 */
exports.guid = function () {
  return function () {
    return faker.random.uuid();
  };
};

/**
 * 随机生成图片地址(真实图片)
 * @param  {integer} width  图片宽度
 * @param  {integer} height 图片高度
 * @param  {string} [type]  可取'animals', 'business', 'cats', 'city', 'food', 'fashion', 'people', 'technics'
 * @return {string}        图片的url
 */
exports.image = function (width, height, type) {
  var thiz = this;
  return function () {
    var imageType = type;
    if (!imageType) {
      imageType = thiz.oneOf(['imageUrl', 'animals', 'business', 'cats', 'city', 'food', 'fashion', 'people', 'technics'])();
    }
    return faker.image[imageType](width, height);
  };
};

/**
 * 日期相关的随机函数
 * @type {Object}
 */
exports.date = {};

/**
 * 随机生成过去的时间
 * @param  {string} [format='YYYY-MM-DD'] 时间格式（参见moment)
 * @return {string}        随机生成的时间字符串
 */
exports.date.past = function (format) {
  return function () {
    return moment(faker.date.past()).format(format || 'YYYY-MM-DD');
  };
};
/**
 * 随机生成未来的时间
 * @param  {string} [format='YYYY-MM-DD'] 时间格式（参见moment)
 * @return {string}        随机生成的时间字符串
 */
exports.date.future = function (format) {
  return function () {
    return moment(faker.date.future()).format(format || 'YYYY-MM-DD');
  };
};
/**
 * 随机生成最近的时间
 * @param  {string} [format='YYYY-MM-DD'] 时间格式（参见moment)
 * @return {string}        随机生成的时间字符串
 */
exports.date.recent = function (format) {
  return function () {
    return moment(faker.date.recent()).format(format || 'YYYY-MM-DD');
  };
};