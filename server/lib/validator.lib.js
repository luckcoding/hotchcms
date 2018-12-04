
function getType (input) {
  return Object.prototype.toString.call(input).toLowerCase()
}

function isJson (input) {
  return getType(input) === '[object object]'
}

function isArray (input) {
  return Array.isArray(input)
}

function isFunction (input) {
  return getType(input) === '[object function]'
}

function isNumber (input) {
  return !isNaN(Number(input))
}

function isNull (input) {
  return getType(input) === '[object null]'
}

function isUndefined (input) {
  return typeof input === 'undefined'
}

function isObjectWithKey (input) {
  return isJson(input) || isArray(input) || isFunction(input)
}

function hasNoValue (input) {
  return isUndefined(input) || isNull(input)
}

module.exports = {
  getType,
  isJson,
  isArray,
  isFunction,
  isNumber,
  isNull,
  isUndefined,
  isObjectWithKey,
  hasNoValue,
}