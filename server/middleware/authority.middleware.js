const _ = require('lodash');
const koaAuthority = require('koa-authority');
const adminUserService = require('../services/admin-user.service');
const routers = require('../routers');

module.exports = () => koaAuthority({
  routes: routers.routes,
  filter: [
    { '/api/common/captcha': [ 'HEAD', 'GET' ] },
    { '/api/admin-account/sign-in': [ 'PUT' ] },
    { '/api/admin-account/sign-out': [ 'PUT' ] },
    { '/api/admin-account': [ 'HEAD', 'GET' ] },
    { '/api/admin-account': [ 'PUT' ] }
  ],
  middleware: async ctx => {
    if (ctx.session && ctx.session.adminUserId) {
      const _id = ctx.session.adminUserId;
      const user = await adminUserService.one({ _id: _id });
      if (user.group && user.group.root) {
        ctx.authorities = ctx.authorityModels;
      } else {
        const authorities = user.group && user.group.authorities;
        ctx.authorities = authorities;
      }
    }
    return Promise.resolve();
  }
});