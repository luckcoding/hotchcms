const jwt = require('jsonwebtoken')
const koaAuthority = require('koa-authority')
const settings = require('../config/settings')
const AdminUser = require('../models/admin-user.model')
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
    let decoded, user, group, authorities = []

    const { authorization } = ctx.header
    if (authorization) {
      const parts = authorization.split(' ')
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {

        decoded = await verify(parts[1], settings.system.secret)

        if (decoded.hasOwnProperty('data')) {
          // query user
          user = await AdminUser.findById(decoded.data).populate('group').lean()

          // set authorities
          if (isJson(user) && user.hasOwnProperty('group')) {
            authorities = user.group.gradation === 100
              ? routes
              : user.group.authorities
          }
        }
      }
    }

    // handle data
    user = isJson(user) ? user : {}
    group = isJson(user.group) ? user.group : {}

    // bind in the ctx
    ctx.state.user = Object.assign(decoded, user, { group }, { authorities })

    return Promise.resolve(authorities)
  },
})
