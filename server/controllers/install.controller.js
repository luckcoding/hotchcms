const send = require('koa-send');
const database = require('../lib/database.lib');
const logger = require('../lib/logger.lib');
const installService = require('../services/install.service');

exports.access = async ctx => {
  try {
    const hasInstall = await installService.status();
    if (hasInstall) {
      next()
    } else {
      await send(ctx, './public/assets/admin/index.html');
    }
  } catch (e) {

  }
}

exports.status = async ctx => {
  try {
    const hasInstall = await installService.status();
    if (hasInstall) {
       ctx.pipeFail(404);
    } else {
      ctx.pipeDone();
    }
  } catch (e) {
    ctx.pipeFail(500);
  }
}

exports.testDatabase = async ctx => {
  ctx.checkBody({
    'host': {
      notEmpty: {
        options: [true],
        errorMessage: 'host 不能为空'
      },
      matches: {
        options: [/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$|^localhost$/],
        errorMessage: 'host 格式不正确'
      }
    },
    'port': {
      notEmpty: {
        options: [true],
        errorMessage: 'port 不能为空'
      },
      isInt: {
        options: [{ min: 0, max: 65535 }],
        errorMessage: 'port 需为0-65535之间的整数'
      }
    },
    'db': {
      notEmpty: {
        options: [true],
        errorMessage: 'database 不能为空'
      },
      isString: { errorMessage: 'database 需为字符串' }
    },
    'user': {
      optional: true,
      isString: { errorMessage: 'user 需为字符串' }
    },
    'pass': {
      optional: true,
      isString: { errorMessage: 'password 需为字符串' }
    }
  });

  if (ctx.validationErrors()) return null;

  try {
    const status = await database.test(ctx.request.body);
    if (status) ctx.pipeDone();
  } catch (e) {
    ctx.pipeFail(e);
  }
};

exports.install = async ctx => {
  ctx.checkBody({
    'dbHost': {
      notEmpty: {
        options: [true],
        errorMessage: 'dbHost 不能为空'
      },
      matches: {
        options: [/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$|^localhost$/],
        errorMessage: 'dbHost 格式不正确'
      }
    },
    'dbPort': {
      notEmpty: {
        options: [true],
        errorMessage: 'dbPort 不能为空'
      },
      isInt: {
        options: [{ min: 0, max: 65535 }],
        errorMessage: 'dbPort 需为整数'
      }
    },
    'db': {
      notEmpty: {
        options: [true],
        errorMessage: 'db 不能为空'
      },
      isString: { errorMessage: 'db 需为字符串' }
    },
    'dbUser': {
      optional: true,
      isString: { errorMessage: 'dbUser 需为字符串' }
    },
    'dbPassword': {
      optional: true,
      isString: { errorMessage: 'dbPassword 需为字符串' }
    },
    'theme': {
      optional: true,
      isString: { errorMessage: 'theme 需为字符串' }
    },
    // 导入示例数据，下一版本
    //'case': {
    //  notEmpty: {
    //    options: [true],
    //    errorMessage: 'case 不能为空'
    //  },
    //  isBoolean: { errorMessage: 'case 需为布尔值' }
    //},
    'title': {
      notEmpty: {
        options: [true],
        errorMessage: 'title 不能为空'
      },
      isString: { errorMessage: 'title 需为字符串' }
    },
    'email': {
      notEmpty: {
        options: [true],
        errorMessage: 'email 不能为空'
      },
      matches: {
        options: [/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/],
        errorMessage: 'email 格式不正确'
      }
    },
    'password': {
      notEmpty: {
        options: [true],
        errorMessage: 'password 不能为空'
      },
      isLength: {
        options: [6],
        errorMessage: 'password 不能小于 6 位'
      }
    }
  });

  if (ctx.validationErrors()) return null;

  const req = ctx.request.body;

  const {
    dbHost, dbPort, db, dbUser, dbPassword,
    title, theme,
    email, password
  } = ctx.request.body;

  const databaseData = {
    host: dbHost,
    port: dbPort,
    db: db,
    // user: dbUser,
    // pass: dbPassword
  };

  const siteInfoData = { title, theme };

  const adminUserData = { email, password };

  try {
    const hasInstall = await installService.status();
    if (hasInstall) return ctx.pipeFail(500, 'cms已经安装');
    const install = await installService.install({
      databaseData: databaseData,
      siteInfoData: siteInfoData,
      adminUserData: adminUserData,
    });

    if (install) {
      ctx.pipeDone();
    }
  } catch (e) {
    ctx.pipeFail(500, e);
  }

}