const _ = require('lodash')
const jwt = require('jsonwebtoken')
const cache = require('../lib/cache.lib')
const sha1 = require('../services/sha1.service')
const AdminUser = require('../models/admin-user.model')
const config = require('../config/system.config')

const { expiresInLong, expiresIn, secret } = config
const { _validator } = AdminUser.schema

/**
 * 登陆
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.signIn = async (ctx) => {
  ctx.checkBody(_validator([
    '*email', '*password',
  ], {
    autoSignIn: {
      optional: true,
      isBoolean: { errorMessage: 'autoSignIn 需为布尔值' },
    },
  }))

  if (ctx.validationErrors()) return null

  try {
    const { email, password, autoSignIn } = ctx.request.body

    const call = await AdminUser.findOne({ email })

    if (call && sha1(password) === call.password) {
      let expires = autoSignIn ? expiresInLong : expiresIn // token 时间

      const _id = call._id.toString()
      const token = jwt.sign({ data: _id }, secret, { expiresIn: expires })
      await cache.set(token, _id, expires) // 以 token 为key
      ctx.pipeDone(token)
    } else {
      ctx.pipeFail('用户名或密码错误', 'BN99')
    }
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 注销
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.signOut = async (ctx) => {
  try {
    const auth = ctx.request.headers.authorization.split(' ')[1]
    // await ctx.redis.del(auth);
    await cache.del(auth)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 查询当前账号
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.current = async (ctx) => {
  try {
    const _id = ctx.state.user.data
    const user = await AdminUser._one(_id)
    ctx.pipeDone(user)
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 更新当前账号
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.update = async (ctx) => {
  ctx.checkBody(_validator(['nickname', 'mobile', 'password', 'avatar']))

  if (ctx.validationErrors()) return null

  try {
    const _id = ctx.state.user.data

    const input = _.pick(ctx.request.body, ['nickname', 'mobile', 'password', 'avatar'])
    if (input.password) input.password = sha1(input.password)

    await AdminUser.update({ _id }, input, { runValidators: true })
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}
