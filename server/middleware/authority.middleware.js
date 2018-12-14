const jwt = require('jsonwebtoken')
const koaAuthority = require('koa-authority')
const validator = require('validator')
const settings = require('../config/settings')
const AdminUser = require('../models/admin-user.model')
const AdminGroup = require('../models/admin-group.model')
const { isJson } = require('../lib/validator.lib')

// decode jwt
const verify = (token, secretStr) => new Promise((resolve) => {
  jwt.verify(token, secretStr, (err, decoded) => {
    err ? resolve({}) : resolve(decoded)
  })
})

module.exports = authRoutes => koaAuthority({
  routes: authRoutes,
  // useKoaRouter: true,
  middleware: async (ctx, { routes }) => {
    let decoded = {}, user = {}, group = {}, authorities = []

    const { authorization } = ctx.header
    if (authorization) {
      const parts = authorization.split(' ')
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {

        decoded = await verify(parts[1], settings.system.secret)
        if (decoded.hasOwnProperty('data')) {
          // query user
          const call = await AdminUser.findById(decoded.data).populate('group').lean()
          
          // set user
          user = call || {}

          if (user.hasOwnProperty('group')) {
            // set group
            group = isJson(user.group) ? user.group : {}

            // set authorities
            authorities = user.group.gradation === 100
              ? routes
              : user.group.authorities
          }
        }
      }
    }

    // bind in the ctx
    ctx.state.user = Object.assign(decoded, user, { group }, { authorities })

    /**
     * bind check auth levl fn
     * @param  {Number or MongoId} gradation [需要校验的权限等级]
     * @return {Boolean}
     */
    ctx.checkGradation = async function (gradation) {
      const hasGradation = group.gradation || 0
      let checkedGradation = gradation

      if (validator.isMongoId(gradation)) {
        const call = await AdminGroup.findById(gradation)
        if (call) {
          checkedGradation = call.gradation
        }
      }

      if (hasGradation > (checkedGradation || 0)) {
        return true
      } else {
        throw Error('Gradation forbidden')
      }
    }

    return Promise.resolve(authorities)
  },
})
