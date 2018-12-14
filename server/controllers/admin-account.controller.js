const lodash = require('lodash')
const jwt = require('jsonwebtoken')
const cache = require('../lib/cache.lib')
const sha1 = require('../lib/sha1.lib')
const AdminUser = require('../models/admin-user.model')
const settings = require('../config/settings')

const { secret, expiresIn, expiresInLong, } = settings.system

/**
 * 登陆
 */
exports.signIn = async (ctx) => {
  ctx.checkBody({
    email: {
      optional: true,
      isEmail: { errorMessage: 'email 格式不正确' }
    },
    mobile: {
      optional: true,
      isMobile: { errorMessage: 'mobile 格式不正确' },
    },
    password: {
      notEmpty: {
        options: [true],
        errorMessage: 'password 不能为空'
      },
    },
    autoSignIn: {
      optional: true,
      isBoolean: { errorMessage: 'autoSignIn 需为布尔值' }
    }
  });

  try {

    const { password, autoSignIn, ...query } = await ctx.pipeInput()

    if (lodash.isEmpty(query)) return ctx.pipeFail('缺少账户信息', 'BN99')

    const call = await AdminUser.findOne(query)
    if (call && sha1(password) === call.password) {
      let expires = autoSignIn ? expiresInLong : expiresIn // token 时间

      const _id = call._id.toString()
      const token = jwt.sign({ data: _id }, secret, { expiresIn: expires })
      // await cache.set(token, _id, expires) // 以 token 为key
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
 */
exports.signOut = async (ctx) => {
  try {
    const { _id, exp } = ctx.state.user
    const expires = exp * 1000 - Date.now()

    const auth = ctx.request.headers.authorization.split(' ')[1]

    // await cache.del(auth)
    await cache.set(auth, _id, expires)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 查询当前账号
 */
exports.current = async (ctx) => {
  try {
    const { _id } = ctx.state.user
    const user = await AdminUser.findById(_id).populate('group')
    ctx.pipeDone(user)
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 更新当前账号
 */
exports.update = async (ctx) => {
  ctx.checkBody({
    email: {
      optional: true,
      isEmail: { errorMessage: 'email 格式不正确' }
    },
    mobile: {
      optional: true,
      isMobile: { errorMessage: 'mobile 格式不正确' },
    },
    nickname: {
      optional: true,
      isString: { errorMessage: 'nickname 需为字符串' }
    },
    password: {
      optional: true,
      isString: { errorMessage: 'password 需为字符串' },
    },
    avatar: {
      optional: true,
      isString: { errorMessage: 'avatar 需为字符串' },
    },
  })

  try {
    const input = await ctx.pipeInput()

    const { _id } = ctx.state.user

    await AdminUser.update({ _id }, input, { runValidators: true })
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}
