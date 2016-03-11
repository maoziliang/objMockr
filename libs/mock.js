var faker = require('faker');
var moment = require('moment');
var _ = require('lodash');
var circularChecker = require('./circularChecker');

var mocks = {};

/**
 * 从数组数据源中随机取一个元素返回
 * @param  {Array} arr 数据源
 * @return {Any}     数据源中随机的元素
 */
mocks.oneOf = function (arr) {
  return function () {
    return faker.random.arrayElement(arr);
  };
};

/**
 * 从数组数据源中随机取n个元素构成新的数组返回
 * @param  {Array} arr     数据源
 * @param  {number} [minimum=0] 生成数组的最少元素个数
 * @param  {number} [maximum=length] 生成数组的最多元素个数
 * @return {Array}         随机生成的数组
 */
mocks.manyOf = function (arr, minimum, maximum) {
  var thiz = this;
  return function () {
    if (minimum === undefined) {
      minimum = 0;
    } else {
      minimum = Math.min(minimum, arr.length);
    }
    if (maximum === undefined) {
      maximum = thiz.number(0, arr.length)();
    } else {
      maximum = Math.min(maximum, arr.length);
    }
    var count = thiz.number(minimum, maximum)();
    var index = [];
    while(index.length < count) {
      var i = thiz.number(0, arr.length - 1)();
      if (index.indexOf(i) === -1) {
        index.push(i);
      }
    }

    var result = [];
    for (var i = 0; i < index.length; i++) {
      result.push(arr[index[i]]);
    }

    return result;
  };
};

/**
 * 最多重复n次执行tpl表示的mock方法，用于根据对象模板生成数组
 * @param  {Mock} tpl     要重复执行的mock方法
 * @param  {integer} mostTimes 次数
 * @return {Array}           重复执行n次tpl的结果数据
 */
mocks.repeatMost = function (tpl, mostTimes) {
  var thiz = this;
  return function () {
    var times = thiz.number(1, mostTimes)();
    return thiz.repeat(tpl, times)();
  };
};

/**
 * 确定的执行n次tpl表示的mock方法，用于根据对象模板生成数组
 * @param  {Mock} tpl   要重复执行的mock方法
 * @param  {integer} times 次数
 * @return {Array}       重复执行n次tpl的结果数据
 */
mocks.repeat = function (tpl, times) {
  var thiz = this;
  return function () {
    return _repeatExec(tpl, times);
  };
};

/**
 * 依赖某个对象模板中的某几个字段生成数据
 * @param  {Array}   fieldNames 依赖的字段名称
 * @param  {Function} callback   随机函数
 * @return {Any}              根据依赖字段值生成的随机值
 */
mocks.depend = function (fieldNames, callback) {
  var func = function () {
    return callback.apply(this, arguments);
  };
  func.dependFields = fieldNames;
  func.fakerType = 'depend';
  return func;
};

// 执行tpl生成数据
//
// 重复n次tpl，生成数组
function _repeatExec(tpl, times) {
  var result = [];
  for (var i = 0; i < times; i++) {
    result.push(mocks.exec(tpl));
  }
  return result;
};

mocks.exec = function (tpl) {
  if (_.isFunction(tpl)) {
    return tpl();
  } else if (_.isPlainObject(tpl)) {
    var result = {};
    var dependFuncs = {};
    for (var key in tpl) {
      if (tpl.hasOwnProperty(key)) {
        if (_.isFunction(tpl[key]) && tpl[key].fakerType === 'depend') {
          dependFuncs[key] = tpl[key];
        } else {
          result[key] = this.exec(tpl[key]);
        }
      }
    }
    var checker = circularChecker.createChecker();
    for (var key in dependFuncs) {
      var node = checker.addChild(key);
      dependFuncs[key].dependFields.forEach(function (field) {
        node.addChild(field);
      });
    }
    var circularResult = checker.check();
    if (circularResult && circularResult.length) {
      throw new Error('Circular dependency detected. ' + circularResult.join(' -> '));
    }
    while (Object.keys(dependFuncs).length > 0) {
      for (var key in dependFuncs) {
        var func = dependFuncs[key];
        var fieldNames = func.dependFields;
        var dependVals = [];
        for (var i = 0; i < fieldNames.length; i++) {
          var name = fieldNames[i];
          if (!result.hasOwnProperty(name)) {
            dependVals = null;
            break;
          } else {
            dependVals.push(result[name]);
          }
        }
        if (dependVals) {
          result[key] = func.apply(undefined, dependVals);
          delete dependFuncs[key];
        }
      }
    }

    return result;
  } else if (_.isArray(tpl)) {
    var result = [];
    for (var i = 0; i < tpl.length; i++) {
      result.push(this.exec(tpl[i]));
    }
    return result;
  } else {
    return tpl;
  }
};

/**
 * 创建一个mocker
 * @param  {Array<string>} locales? ['zh-cn', 'en-us']
 * @param  {Array<object>} customMocks? [YourCustomMocker]
 * @return {Object}         根据locales生成的mocker对象
 */
exports.createMocker = function (locales, customMocks) {
  var result = _.extend({}, require('./normal'));
  _.forEach(locales, function (locale) {
    _.extend(result, require('./localeMocks/' + locale));
  });

  _.forEach(customMocks, function (custom) {
    _.extend(result, custom);
  });
  return _.extend({}, mocks, result);
};