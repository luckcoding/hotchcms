import { Controller, InjectHandle } from '@koa-lite/controller'
import * as controllers from './controllers'
import { transaction } from './db/typeorm'

/**
 * 事务处理
 */
 InjectHandle(({ fn }) => transaction(fn))

export const router = new Controller({
  prefix: '/v2',
  docs: {
    title: '接口文档 - 客户端',
    version: 'v2',
    description: '业务接口文档 - by Hotchcms',
    securities: [{
      type: 'headers',
      key: 'Authorization',
      value: function (data) {
        var ret = (data instanceof Object) && data.ret
        return /^Bearer\s/.test(ret) ? ret : ''
      },
    }, {
      type: 'headers',
      key: 'x-device-id',
      value: '1234',
    }],
  },
})
  .controllers([
    controllers.Article,
    controllers.Common,
    controllers.Dashboard,
  ])
  .get('/', ctx => { ctx.body = 'Hotchcms' })
