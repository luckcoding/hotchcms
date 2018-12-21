exports.random = () => `${Math.floor(Math.random() * 10000000)}`

exports.timeRandom = () => `${new Date().getTime()}${exports.random()}`
