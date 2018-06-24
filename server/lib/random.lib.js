exports.random = function () {
  return `${Math.floor(Math.random() * 10000000)}`
}

exports.timeRandom = function () {
  return `${new Date().getTime()}${exports.random()}`
}