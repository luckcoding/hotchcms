const jwt = require('jsonwebtoken')
const settings = require('../config/settings')

// decode jwt
const verify = (token, secretStr) =>
  new Promise(resolve => {
    jwt.verify(token, secretStr, (err, decoded) => {
      err ? resolve({}) : resolve(decoded)
    })
  })

module.exports = () => async (ctx, next) => {
  let decoded = {}

  const { authorization } = ctx.header

  if (authorization) {
    const parts = authorization.split(' ')
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      decoded = await verify(parts[1], settings.system.secret)
      if (Object.prototype.hasOwnProperty.call(decoded, 'data')) {
        decoded._id = decoded.data
        delete decoded.data
      }
    }
  }

  ctx.state.user = Object.assign({}, ctx.state.user, decoded)

  await next()
}
