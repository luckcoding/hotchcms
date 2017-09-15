/**
 * 随机数
 * @return {Number} [时间戳 + random]
 */
module.exports = () => `${new Date().getTime()}${Math.floor(Math.random() * 10000000)}`
