module.exports = {
  isJson: value => Object.prototype.toString.call(value).toLowerCase() === '[object object]',
  
}