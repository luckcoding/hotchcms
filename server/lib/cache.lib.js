const _ = require('lodash');
const redis  = require('./redis.lib');

exports.get = key => new Promise((resolve, reject) => {
  redis.get(key, (err, data) => {
    if (err) return reject(err);
    try {
      return resolve(JSON.parse(data));
    } catch (e) {
      return resolve(data);
    }
  });
});

exports.set = (key, value, maxAge) => new Promise((resolve, reject) => {
  if (isJson(value) || _.isArray(value)) {
    value = JSON.stringify(value);
  }

  if (!maxAge) {
    redis.set(key, value, err => err ? reject(err) : resolve());
  } else {
    redis.setex(key, parseInt(maxAge / 1000), value, err => err ? reject(err) : resolve()); // 秒为单位
  }
});

exports.del = key => new Promise((resolve, reject) => {
  redis.del(key, err => err ? reject(err) : resolve())
})

function isJson(input) {
  return Object.prototype.toString.call(input).toLowerCase() === '[object object]'
}
