const ioredis = require('ioredis');

const redis = new ioredis({
  host: '127.0.0.1',
  port: 6379,
  family: 4,
  db: 0
});

redis.on('connect', function () {
  console.log('redis 已连接');
});

redis.on('ready', function () {
  console.log('redis 已准备');
});

redis.on('reconnect', function () {
  console.log('redis 重新连接');
});

redis.on('error', function (err) {
  console.log('redis 错误: %j', err.stack || err);
});

redis.on('end', function () {
  console.log('redis 已关闭');
});

module.exports = redis;