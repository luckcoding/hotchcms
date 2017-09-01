const _ = require('lodash');
const redis = require('./redis.lib');

exports.get = key => new Promise(async (resolve, reject) => {
  const client = await redis.connect();
  client.get(key, (err, data) => {
    if (err) return reject(err);
    try {
      return resolve(JSON.parse(data));
    } catch (e) {
      return resolve(data);
    }
  });
});

exports.set = (key, value, maxAge) => new Promise(async (resolve, reject) => {
  if (isJson(value) || _.isArray(value)) {
    value = JSON.stringify(value);
  }
  const client = await redis.connect();
  if (!maxAge) {
    client.set(key, value, err => err ? reject(err) : resolve());
  } else {
    client.setex(key, parseInt(maxAge / 1000), value, err => err ? reject(err) : resolve()); // 秒为单位
  }
});

exports.del = key => new Promise(async (resolve, reject) => {
  const client = await redis.connect();
  client.del(key, err => err ? reject(err) : resolve())
})

function isJson(input) {
  return Object.prototype.toString.call(input).toLowerCase() === '[object object]'
}
