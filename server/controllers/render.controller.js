const _ = require('lodash')
const validator = require('validator')
const { Category, Content } = require('../models')

const { SiteInfo, ThemeInfo } = require('../services/site.service')

/**
 * 过滤路由
 * 分类:     /category
 * 内容:     /category/contentId
 * 单页:     /xxxx.html
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
const filter = (target = '') => {
  const parts = target.split('/')

  if (parts.length > 2) return false
  if (parts.length === 2) return !!validator.isMongoId(parts[1])

  return true
}

module.exports = async (ctx) => {
  try {
    const { target } = ctx.params

    // 获取主题
    const theme = await ThemeInfo()._default()
    if (!theme) {
      ctx.body = '请登录后台设置主题'
      return null
    }

    // 主题文件夹名
    const { alias } = theme

    // 前端加载路径
    const source = `/theme/${alias}`

    const navigation = await Category._navigation()

    if (!filter(target)) {
      return await ctx.render(`${alias}/module/404`, {
        siteInfo: { title: '404' },
        current: '/404',
        source,
      })
    }

    // 获取网站信息
    const siteInfo = await SiteInfo().get()

    // const categories = _.map(navigation, 'path')
    const categoryRaw = _.keyBy(navigation, 'path')

    // 获取文章列表
    const article = await Content._list({
      page: 1,
      size: 20,
    })

    // 首页
    if (_.includes([undefined, 'index.html', 'index.htm'], target)) {
      let current = '/'
      _.forEach(navigation, (item) => {
        if (item.isHome) current = item.path
      })
      return await ctx.render(`${alias}/module/home`, {
        siteInfo,
        // categories: {},
        navigation,
        current,
        source,
        article,
      })
    } else if (categoryRaw[target]) {
      return await ctx.render(`${alias}/module/home`, {
        siteInfo,
        // categories: {},
        navigation,
        current: target,
        source,
        article,
      })
    }

    // const categories = await Category._path()
  } catch (e) {
    ctx.pipeFail(e)
  }
}
