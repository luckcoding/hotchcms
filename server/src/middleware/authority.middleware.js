const koaAuthority = require('koa-authority')
const validator = require('validator')
const AdminUser = require('../models/admin-user.model')
const AdminGroup = require('../models/admin-group.model')
const { isJson } = require('../lib/validator.lib')

module.exports = authRoutes => koaAuthority({
  routes: authRoutes,
  // useKoaRouter: true,
  middleware: async (ctx, { routes }) => {
    let user = {}
    let group = {}
    let authorities = []

    const { _id } = ctx.state.user

    if (_id) {
      // query user
      const call = await AdminUser.findById(_id)
        .populate('group')
        .lean()

      // set user
      user = call || {}

      if (Object.prototype.hasOwnProperty.call(user, 'group')) {
        // set group
        group = isJson(user.group) ? user.group : {}

        // set authorities
        authorities = user.group.gradation === 100 ? routes : user.group.authorities
      }
    }

    // bind in the ctx
    ctx.state.user = Object.assign(
      {},
      ctx.state.user,
      user,
      { group },
      { authorities },
    )

    /**
       * bind check auth levl fn
       * @param  {Number , MongoId} gradation [需要校验的权限等级]
       * @return {Boolean}
       */
    ctx.checkGradation = async (gradation) => {
      const hasGradation = group.gradation || 0
      let checkedGradation = gradation

      if (typeof gradation === 'string' && validator.isMongoId(gradation)) {
        const call = await AdminGroup.findById(gradation)
        if (call) {
          checkedGradation = call.gradation
        }
      }

      if (hasGradation > checkedGradation) {
        return true
      }

      throw Error('Gradation forbidden')
    }

    return Promise.resolve(authorities)
  },
})
