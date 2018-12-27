const _ = require('lodash')
const media = require('../lib/media.lib')
const { Media } = require('../models')

/**
 * 上传文件
 */
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
  })

  try {
    const input = await ctx.pipeInput()

    let files = ctx.request.files.file
    if (!files) throw Error('上传内容不能为空')
    // 默认多文件上传
    files = _.isArray(files) ? files : new Array(files)

    const mediaType = input['media-type']

    // 解析
    const asyncInfo = files.map((file) => {
      const fileJson = file.toJSON()
      if (!_.includes(fileJson.type, mediaType)) throw Error(`存在非${mediaType}的资源`)
      return media.parse(fileJson)
    })

    // 解析后的数据
    let info = await Promise.all(asyncInfo)

    // 保存任务对象
    const asyncUpload = []

    info = info.map((item) => {
      // 添加任务
      asyncUpload.push(media.upload(item))

      return { ...item, type: mediaType }
    })

    await Promise.all(asyncUpload)

    // 数据库存储
    const medias = await Media.create(info)

    ctx.pipeDone(medias)
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 文件列表
 */
exports.list = async (ctx) => {
  ctx.sanitizeQuery('page').toInt()
  ctx.sanitizeQuery('pageSize').toInt()
  ctx.checkQuery({
    type: {
      optional: true,
      isIn: {
        options: [['image', 'zip']],
        errorMessage: 'type 必须为 image/zip',
      },
    },
  })
  try {
    const { page = 1, pageSize = 10, ...query } = await ctx.pipeInput()

    const total = await Media.count(query)
    const list = await Media.find(query)
      .sort('-date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select()
      .lean()

    ctx.pipeDone({
      list,
      total,
      pageSize,
      page,
    })
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 多选操作
 */
exports.multi = async (ctx) => {
  ctx.checkBody({
    type: {
      notEmpty: {
        options: [true],
        errorMessage: 'type 不能为空',
      },
      isIn: {
        options: [['remove', 'add', 'update']],
        errorMessage: 'type 必须为 remove/add/update',
      },
    },
    multi: {
      optional: true,
      inArray: {
        options: ['isMongoId'],
        errorMessage: 'multi 内需为 mongoId',
      },
    },
  })

  try {
    const { multi, type } = await ctx.pipeInput()

    if (type === 'remove') {
      await Media.remove({ _id: { $in: multi } })
      ctx.pipeDone()
    } else {
      ctx.pipeFail(`暂无${type}操作`, 'BN99')
    }
  } catch (e) {
    ctx.pipeFail(e)
  }
}
