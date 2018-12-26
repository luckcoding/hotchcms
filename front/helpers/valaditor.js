export function getType(input) {
  return Object.prototype.toString.call(input).toLowerCase()
}

export function isJson(input) {
  return getType(input) === '[object object]'
}

export function isArray(input) {
  return Array.isArray(input)
}

export function isFunction(input) {
  return getType(input) === '[object function]'
}

export function isNumber(input) {
  return !Number.isNaN(Number(input))
}

export function isNull(input) {
  return getType(input) === '[object null]'
}

export function isUndefined(input) {
  return typeof input === 'undefined'
}

export function isObjectWithKey(input) {
  return isJson(input) || isArray(input) || isFunction(input)
}

export function hasNoValue(input) {
  return isUndefined(input) || isNull(input)
}
