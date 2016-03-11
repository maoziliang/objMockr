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

