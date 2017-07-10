const mongoose = require('mongoose');
// const MongooseStore = require('koa-session-mongoose');
const RedisStore = require('koa-redis');

module.exports = {
  key: 'hotchcmsSid',
  cookie: {
    httpOnly: false,
  },
  // store: new MongooseStore({
  //   connection: mongoose.connection,
  // })
  store: RedisStore({
    host: '127.0.0.1',
    port: 6379
  })
};