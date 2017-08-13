/**
 * 错误处理
 * @param {[type]} message [description]
 * @param {[type]} type    [description]
 */
function Throw(message, type) {
  this.type = type || 'system';
  this.message = message || 'Error';
  this.stack = (new Error()).stack;
};

Throw.prototype = Object.create(Error.prototype);
Throw.prototype.constructor = Throw;

module.exports = Throw;