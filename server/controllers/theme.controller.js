const ThemeLib = require('../lib/theme.lib')
const { Theme } = require('../models')

exports.install = async (ctx) => {
  ctx.checkHeaders({
    'content-type': {
      notEmpty: {
        options: [true],
        errorMessage: 'content-type 不能为空',
      },
      matches: {
        options: [/multipart\/form-data/i],
        errorMessage: '数据需为文件格式',
      },
    },
  })

  if (ctx.validationErrors()) return null

  try {
    let { file } = ctx.request.files
    const info = await ThemeLib.install(file)
    await Theme._install(info)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

exports.list = async (ctx) => {
  try {
    const call = await Theme._list()
    ctx.pipeDone(call)
  } catch (e) {
    ctx.pipeFail(e)
  }
}

exports.set = async (ctx) => {
  ctx.checkParams({
    _id: {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空',
      },
      isMongoId: { errorMessage: '_id  需为 mongoId' },
    },
  })

  if (ctx.validationErrors()) return null

  try {
    await Theme._set(ctx.params._id)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

exports.uninstall = async (ctx) => {
  ctx.checkParams({
    _id: {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空',
      },
      isMongoId: { errorMessage: '_id  需为 mongoId' },
    },
  })

  if (ctx.validationErrors()) return null

  try {
    await Theme._uninstall(ctx.params._id)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}
