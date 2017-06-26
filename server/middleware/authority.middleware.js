const koaAuthority = require('koa-authority');
const adminUserService = require('../services/admin-user.service');
const routers = require('../routers');

module.exports = () => koaAuthority({
  routes: routers.routes,
  authorities: [
    { '/api/admin-account/sign-in': [ 'PUT' ] },
    { '/api/common/captcha': [ 'HEAD', 'GET' ] },
    { '/api/admin-account/sign-out': [ 'PUT' ] }
  ],
  middleware: async ctx => {
    if (ctx.session && ctx.session.adminUserId) {
      const _id = ctx.session.adminUserId;
      const user = await adminUserService.one({ _id: _id });
      if (user.group.name === '管理员') {
        ctx.authorities = ctx.authorityModels;
      } else {
        ctx.authorities = user.group.authorities;
      }
    }
    return Promise.resolve();
  }
});