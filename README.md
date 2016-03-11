# objMockr

objMockr是一个用来生成数据的类库，使用起来非常直观，在mock数据时非常有效。

## object template

Object template，对象的模板。

示例: 

### simple template

``` javascript
// 生成1~100的template
mocker.number(1, 100);

// 生成过去日期的template
mocker.date.past();

// 可以使用mock.exec执行template得到随机结果
mocker.exec(mocker.date.past());
```

### repeat template
``` javascript
// repeat方法得到一个模板，该模板被执行时，生成的数组大小为4
mocker.repeat(mocker.number(1, 100), 4);

// repeatMost方法得到一个模板，该模板被执行时，生成的数组元素个数最多为4
mocker.repeatMost(mocker.number(1, 100), 4);

// 一个常见的对象模板，包含多个属性，可以由简单的template组合起来
var tpl = {
  age: mocker.number(1, 99),
  birth: mocker.date.past(),
  deathday: mocker.date.future(),
  gooddays: mocker.repeatMost(mocker.date.future(), 4)
};
```

## 执行模板

### Basic

``` javascript
// 引入本地化的mocker方法集合
var mocker = require('objMockr').createMocker(['zh-cn']);

// eg. 刘先生
mocker.exec(mocker.missOrMr());

// eg. 14929902341
mocker.exec(mocker.mobile());

mocker.exec(mocker.repeat(mocker.missOrMr(), 3));
```

### Advance

``` javascript
var tpl = {
  age: mocker.number(1, 99),
  birth: mocker.date.past(),
  deathday: mocker.date.future(),
  gooddays: mocker.repeatMost(mocker.date.future(), 4)
};

/*
result: 
{
  age: 10,
  birth: '1999-12-01',
  deathday: '3199-03-18',
  gooddays: ['1999-12-01', '2019-03-18']
}
*/
var result = mocker.exec(tpl);
```

## Custom Mock Functions

mock function是用来执行后生成template function的方法，所以定义起来非常简答。

``` javascript
// Basic
exports.food = function () {
  return function () {
    return '苹果';
  };
};

// 使用内置mock方法
exports.food = function () {
  var thiz = this;
  return function () {
    return thiz.oneOf(['苹果', '米饭', '粽子', '包子', '桃子'])();
  };
};
```

## API

### createMocker(locales?, customMocks?)
生成一个mocker对象

  * locales      {Array<string>}   eg. ['zh-cn', 'en-us']  
  * customMocks  {Array<object>}   自定义的mock对象，会合并到导出的mocker对象上，这样的话，自定义mock方法就可以使用this访问内置的mock方法

### mocker对象

mocker对象除了`exec`方法外所有的方法都返回template方法。

#### exec(tpl)
执行template方法得到一个随机值

#### oneOf(arr)
从arr中随机一个元素返回

#### manyOf(arr, minimum, maximum)
从arr中随机返回n个元素，minimum <= n <= maximum

#### repeatMost(tplFn, maximum)
随机执行n次tplFn方法，1 <= n <= maximum，最终得到一个数组

#### repeat(tplFn, times)
随机执行n此tplFn方法，n === times

#### depend(fieldNames, callback)
上下文相关的字段，需要使用depend来进行处理

eg.

``` javascript
var tpl = {
  '语文': mocker.number(0, 100),
  '数学': mocker.number(0, 100),
  '总分': mocker.depend(['语文', '数学'], function (yuwen, shuxue) {
    return yuwen + shuxue;
  })
}
```

### 常见mock方法列表：

isTrue, number, decimal, guid, image, date.past, date.future, date.recent

### zh-cn本地化mock方法列表

missOrMr, mobile, provinceAbbr, carPlate

