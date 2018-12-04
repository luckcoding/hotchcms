const regx = require('../lib/regx.lib')
const mongodb = require('../lib/mongodb.lib')
const redis = require('../lib/redis.lib')
const installLib = require('../lib/install.lib')

/**
 * 查询安装状态
 */
exports.status = async (ctx) => {
  try {
    const hasInstall = await installLib.status()
    hasInstall ? ctx.pipeFail('已安装') : ctx.pipeDone('可安装')
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 检测数据库
 */
exports.testDatabase = async (ctx) => {
  ctx.checkBody({
    host: {
      notEmpty: {
        options: [true],
        errorMessage: 'host 不能为空',
      },
      matches: {
        options: [regx.host],
        errorMessage: 'host 格式不正确',
      },
    },
    port: {
      notEmpty: {
        options: [true],
        errorMessage: 'port 不能为空',
      },
      isInt: {
        options: [{ min: 0, max: 65535 }],
        errorMessage: 'port 需为0-65535之间的整数',
      },
    },
    db: {
      notEmpty: {
        options: [true],
        errorMessage: 'db 不能为空',
      },
      isString: { errorMessage: 'db 需为字符串' },
    },
    user: {
      optional: true,
      isString: { errorMessage: 'user 需为字符串' },
    },
    pass: {
      optional: true,
      isString: { errorMessage: 'pass 需为字符串' },
    },
  })

  if (ctx.validationErrors()) return null

  try {
    await mongodb.test(ctx.request.body)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 检测redis
 */
exports.testRedis = async (ctx) => {
  ctx.checkBody({
    host: {
      notEmpty: {
        options: [true],
        errorMessage: 'host 不能为空',
      },
      matches: {
        options: [regx.host],
        errorMessage: 'host 格式不正确',
      },
    },
    port: {
      notEmpty: {
        options: [true],
        errorMessage: 'port 不能为空',
      },
      isInt: {
        options: [{ min: 0, max: 65535 }],
        errorMessage: 'port 需为0-65535之间的整数',
      },
    },
    family: {
      notEmpty: {
        options: [true],
        errorMessage: 'family 不能为空',
      },
      matches: {
        options: [/^(IPv4|IPv6)$/],
        errorMessage: 'family 为 IPv4 或 IPv6',
      },
    },
    db: {
      notEmpty: {
        options: [true],
        errorMessage: 'db 不能为空',
      },
      isInt: {
        options: [{ min: 0, max: 10 }],
        errorMessage: 'db 需为0-10之间的整数',
      },
    },
    pass: {
      optional: true,
      isString: { errorMessage: 'pass 需为字符串' },
    },
  })

  if (ctx.validationErrors()) return null

  try {
    await redis.test(ctx.request.body)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 安装
 */
exports.install = async (ctx) => {
  ctx.checkBody({
    dbHost: {
      notEmpty: {
        options: [true],
        errorMessage: 'dbHost 不能为空',
      },
      matches: {
        options: [regx.host],
        errorMessage: 'dbHost 格式不正确',
      },
    },
    dbPort: {
      notEmpty: {
        options: [true],
        errorMessage: 'dbPort 不能为空',
      },
      isInt: {
        options: [{ min: 0, max: 65535 }],
        errorMessage: 'dbPort 需为整数',
      },
    },
    db: {
      notEmpty: {
        options: [true],
        errorMessage: 'db 不能为空',
      },
      isString: { errorMessage: 'db 需为字符串' },
    },
    dbUser: {
      optional: true,
      isString: { errorMessage: 'dbUser 需为字符串' },
    },
    dbPassword: {
      optional: true,
      isString: { errorMessage: 'dbPassword 需为字符串' },
    },
    rdHost: {
      notEmpty: {
        options: [true],
        errorMessage: 'rdHost 不能为空',
      },
      matches: {
        options: [regx.host],
        errorMessage: 'rdHost 格式不正确',
      },
    },
    rdPort: {
      notEmpty: {
        options: [true],
        errorMessage: 'rdPort 不能为空',
      },
      isInt: {
        options: [{ min: 0, max: 65535 }],
        errorMessage: 'rdPort 需为0-65535之间的整数',
      },
    },
    rdFamily: {
      notEmpty: {
        options: [true],
        errorMessage: 'rdFamily 不能为空',
      },
      matches: {
        options: [/^(IPv4|IPv6)$/],
        errorMessage: 'rdFamily 为 IPv4 或 IPv6',
      },
    },
    rdDb: {
      notEmpty: {
        options: [true],
        errorMessage: 'rdDb 不能为空',
      },
      isInt: {
        options: [{ min: 0, max: 10 }],
        errorMessage: 'rdDb 需为0-10之间的整数',
      },
    },
    rdPass: {
      optional: true,
      isString: { errorMessage: 'rdPass 需为字符串' },
    },
    email: {
      notEmpty: {
        options: [true],
        errorMessage: 'email 不能为空',
      },
      matches: {
        options: [regx.email],
        errorMessage: 'email 格式不正确',
      },
    },
    password: {
      notEmpty: {
        options: [true],
        errorMessage: 'password 不能为空',
      },
    },
  })

  if (ctx.validationErrors()) return null

  const {
    dbHost, dbPort, db, dbUser, dbPassword,
    rdHost, rdPort, rdFamily, rdDb, rdPass,
    email, password,
  } = ctx.request.body

  try {
    const hasInstall = await installLib.status()
    if (hasInstall) return ctx.pipeFail('cms已经安装')
    await installLib.install({
      databaseData: {
        host: dbHost,
        port: dbPort,
        db,
        user: dbUser,
        pass: dbPassword,
      },
      redisData: {
        host: rdHost,
        port: rdPort,
        db: rdDb,
        family: rdFamily,
        pass: rdPass,
      },
      adminUserData: {
        email,
        password,
      },
    })

    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}
