const fs = require('fs');
const path = require('path');
const redis = require('redis');

const configFile = () => path.join(__dirname,'../config/redis.config.json');

let redisClient;

exports.test = ({ host, port, family, db, pass }) => new Promise((resolve, reject) => {
  const client = redis.createClient({ host, port, family, db });
  pass && client.auth(pass);
  client.on("connect", () => resolve());
  client.on("end", () => reject());
  client.on("error", err => reject(err));
});

exports.init = options => new Promise((resolve, reject) => {
  fs.writeFile(configFile(), JSON.stringify(options, null, 2), err => {
    err ? reject(err) : resolve(true);
  });
});

exports.connect = () => new Promise((resolve, reject) => {
  if (redisClient) return resolve(redisClient);

  fs.readFile(configFile(), async (err, file) => {
    if (err) {
      if (err.code === 'ENOENT') {
        err.message = 'redis.config.json 文件不存在';
      }
      return reject(error);
    };

    try {
      const { host, port, db, family, pass } = JSON.parse(file);

      const client = redis.createClient({ host, port, family, db });
      pass && client.auth(pass);
      client.on('connect', () => {
        redisClient = client;
        resolve(client)
      });
      client.on('error', e => reject(e));
    } catch (e) {
      reject(e);
    }
  });
});

// module.exports = client;