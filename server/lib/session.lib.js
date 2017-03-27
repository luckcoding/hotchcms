const session = require('koa-generic-session');
const mongoose = require('mongoose');
const sessionConfig = require('../../config/session.config');

exports.check = () => async (ctx, next) => {
  if (!mongoose.connection.name) {
    ctx.session = 'init';
  } else {
    if (ctx.session = 'init') delete ctx.session;
  }
  await next();
}

exports.init = () => session(sessionConfig);
