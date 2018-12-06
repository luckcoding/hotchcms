const { Category } = require('../models')
const { list } = require('../controllers/article.controller')

exports.getSiteInfo = async (ctx) => {
  try {
    const call = await SiteInfo().get()
    ctx.pipeDone(call)
  } catch (e) {
    ctx.pipeFail(e)
  }
}

exports.getCategories = async (ctx) => {
  try {
    const call = await Category._tree()
    ctx.pipeDone(call)
  } catch (e) {
    ctx.pipeFail(e)
  }
}

exports.getArticles = list