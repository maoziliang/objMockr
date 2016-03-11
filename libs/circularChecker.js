function Node(name) {
  this._name = name;
  this._nodes = [];
  this._count = 0;
};

function createChecker() {
  var name = '';
  var node = new Node(name);
  node._root = node;
  node._children = {};
  node._children[name] = node;
  return node;
};

/**
 * 添加子节点
 * @param {string} node 子节点
 */
Node.prototype.addChild = function (name) {
  var root = this._root;
  var node = root._children[name] || new Node(name);
  node._root = root;
  root._children[name] = node;
  this._nodes.push(node);
  return node;
};

/**
 * 检测是否有循环依赖
 * @return {Array} 循环依赖的路径节点
 */
Node.prototype.check = function () {
  var path = [];
  traverseNode(this, path);
  path.shift();
  return path;
};

/**
 * 后序遍历所有的树节点
 * @param  {Node} node 访问来源
 * @param  {Array} path 遍历的路径
 */
function traverseNode(node, path) {
  node._count++;
  path.push(node._name);
  if (node._count > 1) {
    return true;
  }
  var children = node._nodes;
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var circular = traverseNode(child, path);
    if (circular) {
      return true;
    }
  }
  path.pop();
  node._count--;
  return false;
};

module.exports = {
  createChecker: createChecker
};

if (require.main === module) {
  var checker = createChecker();
  var nodeA = checker.addChild('a');
  var nodeB = nodeA.addChild('b');
  var nodeC = nodeA.addChild('c');
  var nodeD = nodeA.addChild('d');
  nodeB.addChild('e').addChild('d').addChild('c').addChild('b');
  console.log(checker.check().join(' -> '));
}