module.exports = async (ctx) => {
  const siteInfo = {
    title: 'hotchcms',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站',
  }
  await ctx.render('default/template', { siteInfo })
}
