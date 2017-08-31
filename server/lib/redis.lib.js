const redis = require('redis');
const config = require('../config/redis.config.json');

const client = redis.createClient({
  host: config.host,
  port: config.port,
  family: config.family,
  db: config.db,
  // password: config.pass
});

// client.auth(config.pass);

client.on("connect", function () {
  console.log('redis connect')
});

module.exports = client;