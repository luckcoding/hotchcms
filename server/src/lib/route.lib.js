const path = require('path')
const _ = require('lodash')
const Router = require('koa-router')
const requireAll = require('require-all')
const routes = require('../routes')

const router = new Router() // 基础路由
// const auth = new Router() // 验权路由
const authRoutes = [] // 验权路由
const notes = {} // 路由描述

/**
 * 读取控制器
 */
const controllers = requireAll({
  dirname: path.join(__dirname, '../controllers/'),
  filter: /(.+)\.controller\.js$/,
})(
  (function loop(map, route = '') {
    _.forEach(map, (value, key) => {
      if (_.isObject(value) && !_.isArray(value)) {
        // { '/path': { ... }}
        loop(value, route + key)
      } else if (_.isString(value)) {
        /**
         * 'controller.action'
         * 'controller.action#description'
         * '*controller.action'
         * 'controller'
         */

        // 是否需要验权限
        const inAuthed = value.indexOf('*') !== -1

        // 需要验证登录状态
        const inChecked = value.indexOf('*') !== -1 || value.indexOf('@') !== -1

        // 抽离 => controller.action # 备注
        const parts = value.replace(/(\*|@)/g, '').split('#')

        // 备注
        const description = parts[1] || ''

        const combParts = parts[0].split('.')

        // 提取controller / action
        const controller = combParts[0]
        const action = combParts[1]

        // 路由描述
        notes[`${route}[${key.toUpperCase()}]`] = description

        // 获取控制器函数
        const fn = action
          ? controllers[controller][action]
          : controllers[controller]

        // 路由绑定函数
        if (inAuthed) {
          // auth[key](route, fn)
          authRoutes.push({ path: route, methods: [key] })
        }

        if (inChecked) {
          router[key](route, controllers.check()) // 验证状态
        }

        router[key](route, fn)
      }
    })
  })(routes)
)

module.exports = router
module.exports.authRoutes = authRoutes
module.exports.notes = notes
