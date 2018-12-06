const _ = require('lodash')
const media = require('../lib/media.lib')
const {
  Media,
} = require('../models')

exports.create = async (ctx) => {
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
    'media-type': {
      notEmpty: {
        options: [true],
        errorMessage: 'media-type 不能为空',
      },
      isIn: {
        options: [['image', 'zip']],
        errorMessage: 'media-type 必须为 image/zip',
      },
    },
    'media-middle': {
      optional: true,
      matches: {
        options: [/(rename)/i],
        errorMessage: 'media-type 必须为 rename',
      },
    },
  })

  try {

    const input = await ctx.pipeInput()

    let files = ctx.request.files.file
    if (!files) throw Error('上传内容不能为空')
    // 默认多文件上传
    files = _.isArray(files) ? files : new Array(files)

    const mediaType = input['media-type']

    // 解析
    const asyncInfo = files.map(file => {
      const fileJson = file.toJSON()
      if (!_.includes(fileJson.type, mediaType)) throw Error(`存在非${mediaType}的资源`)
      return media.parse(fileJson)
    })
    const info = await Promise.all(asyncInfo)

    // 保持文件
    const asyncUpload = info.map(item => media.upload(item))
    await Promise.all(asyncUpload)

    // 数据库存储
    const medias = await Media.create(info)

    ctx.pipeDone(medias)
  } catch (e) {
    ctx.pipeFail(e)
  }
}

exports.list = async (ctx) => {
  ctx.sanitizeQuery('page').toInt()
  ctx.sanitizeQuery('pageSize').toInt()
  ctx.checkQuery({
    name: {
      optional: true,
      isString: { errorMessage: 'name  需为 String' },
    },
    suffix: {
      optional: true,
      isString: { errorMessage: 'suffix  需为 String' },
    },
  })
  try {
    const {
      page = 1, pageSize = 10,
      ...query
    } = await ctx.pipeInput()

    const total = await Media.count(query)
    const list = await Media.find(query)
      .sort('-date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('path md5 date size quotes')
      .lean()

    ctx.pipeDone({ list, total, pageSize, page })
  } catch (e) {
    ctx.pipeFail(e)
  }
}
