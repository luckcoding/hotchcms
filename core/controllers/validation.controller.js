const _ = require('lodash');
const logger = require('../lib/logger.lib');
const usersService = require('../services/users.service');

/**
 * 验证用户权限
 * @param {[Number]} authorities
 */
module.exports = authorities => async (ctx, next) => {
  const _id = ctx.session.user;
  const user = await usersService.one({_id: _id});
  if (user) {
    const pass = _.find(_.get(user, 'role.authorities'), userAuthority => {
      if (userAuthority === 100000) return true;
      return _.find(authorities, authority => authority === userAuthority);
    });
    if (pass) {
      return next();
    } else {
      return ctx.pipeFail(500,'没有权限');
    }
  } else {
    return ctx.pipeFail(500,'找不到用户或用户不存在');
  }
}