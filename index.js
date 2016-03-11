var mock = require('./libs/mock');

/**
 * 创建一个mocker
 * @param  {Array} locales ['zh-cn', 'en-us']
 * @return {Object}         根据locales生成的mocker对象
 */
exports.createMocker = mocks.createMocker;