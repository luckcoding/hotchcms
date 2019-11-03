/**
 * 错误处理
 * @param {string} message
 * @param {string} code
 */
function Throw(message: string, code: string) {
  this.message = message || 'Error'
  this.code = code
  this.stack = new Error().stack
}

Throw.prototype = Object.create(Error.prototype)
Throw.prototype.constructor = Throw

export default (message: string, type: string) => new Throw(message, type)