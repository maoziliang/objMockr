var faker = require('faker');

faker.locale = 'zh_CN';
/**
 * 随机生成'X先生'/'X小姐'的字符串
 * @return {string} 小姐或者先生的3字字符串
 */
exports.missOrMr = function () {
  var thiz = this;
  return function () {
    return faker.name.firstName() + (thiz.isTrue(0.5)() ? '先生' : '小姐');
  };
};

/**
 * 随机生成手机号码
 * @return {string} 手机号码
 */
exports.mobile = function () {
  var thiz = this;
  return function () {
    return '1' + thiz.oneOf([3, 5, 8])() + thiz.number(100000000, 999999999)();
  };
};

/**
 * 随机生成中国省份的简称
 * @return {string} 省份的简称，例如沪、赣
 */
exports.provinceAbbr = function () {
  var thiz = this;
  return function () {
    return thiz.oneOf([
      '沪', '苏', '冀', '豫', '云', '辽', '黑', '湘', '皖', '鲁',
      '新', '苏', '浙', '赣', '鄂', '桂', '甘', '晋', '蒙', '陕',
      '吉', '闽', '贵', '粤', '川', '青', '藏', '琼', '宁', '渝'
      ])();
  };
};

/**
 * 随机生成车牌号码
 * @return {string} 车牌号码
 */
exports.carPlate = function () {
  var thiz = this;
  return function() {
    return thiz.provinceAbbr()() + thiz.oneOf(['A', 'B', 'C', 'D', 'E'])() + thiz.number(10000, 99999)();
  };
};