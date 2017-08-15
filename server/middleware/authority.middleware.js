const _ = require('lodash');
const koaAuthority = require('koa-authority');
const AdminUser = require('../models/admin-user.model');

module.exports = route => koaAuthority({
  routes: route,
  filter: route.filter,
  middleware: async ctx => {
    let _id = null;
    try {
      _id = ctx.state.user.data;
    } catch (e) {}
    if (_id) {
      const user = await AdminUser.findById(_id).populate('group').lean();
      if (_.pick(user, 'group.root')) {
        ctx.authorities = ctx.authorityModels;
      } else {
        const authorities = user.group && user.group.authorities;
        ctx.authorities = authorities;
      }
    }
    return Promise.resolve();
  }
});