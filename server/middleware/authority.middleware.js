const jwt = require('jsonwebtoken');
const koaAuthority = require('koa-authority');
const AdminUser = require('../models/admin-user.model');

const verify = (token, secret) => new Promise((resolve, reject) => {
  jwt.verify(token, secret, (err, decoded) => err ? reject(err) : resolve(decoded))
});

module.exports = route => koaAuthority({
  routes: route.auth,
  middleware: async (ctx, auth) => {
    let _id = null;
    let authorities = [];
    try {
      const parts = ctx.header.authorization.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        const decoded = await verify(parts[1], 'hotchcms');
        ctx.state.user = decoded;
        _id = ctx.state.user.data;
      }
    } catch (e) {}

    if (_id) {
      const user = await AdminUser.findById(_id).populate('group').lean();
      if (user && user.group) {
        if (user.group.gradation === 100) {
          authorities = auth.scatter;
        } else {
          authorities = user.group.authorities;
        }
      }
    }
    return Promise.resolve(authorities);
  }
});