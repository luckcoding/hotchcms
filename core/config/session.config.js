const mongoose = require('mongoose');
const MongooseStore = require('koa-session-mongoose');

module.exports = {
  key: 'caixieSid',
  cookie: {
    httpOnly: false,
  },
  store: new MongooseStore({
    connection: mongoose.connection,
  })
};