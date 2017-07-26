const ioredis = require('ioredis');
const config = require('../config/redis.config.json');

module.exports = function (options) {
  const redis = new ioredis({
    host: config.host,
    port: config.port,
    family: config.family,
    db: config.db,
    // password: config.pass
  });
  redis.on('connect', () => {
    console.log('redis 连接成功');
  });
  redis.on('error', err => {
    console.log('redis 错误: %j', err.stack || err);
  });

  return async (ctx, next) => {
    ctx.redis = redis;
    await next();
  };
};