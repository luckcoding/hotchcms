const jwt = require('jsonwebtoken')
const koaAuthority = require('koa-authority')
const config = require('../config')
const AdminUser = require('../models/admin-user.model')

const { secret } = config

const verify = (token, secretStr) => new Promise((resolve) => {
  jwt.verify(token, secretStr, (err, decoded) => {
    err ? resolve({}) : resolve(decoded)
  })
})

module.exports = authRoute => koaAuthority({
  routes: authRoute,
  middleware: async (ctx, auth) => {
    let _id = null
    let authorities = []

    const { authorization } = ctx.header
    if (authorization) {
      const parts = authorization.split(' ')
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        const decoded = await verify(parts[1], secret)
        ctx.state.user = decoded
        _id = ctx.state.user.data

        console.log(ctx.state.user)
      }
    }

    if (_id) {
      const user = await AdminUser.findById(_id).populate('group').lean()
      if (user && user.group) {
        if (user.group.gradation === 100) {
          authorities = auth.scatter
        } else {
          authorities = user.group.authorities
        }
      }
    }

    ctx.authorities = authorities
    return Promise.resolve(authorities)
  },
})
