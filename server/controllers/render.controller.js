exports.index = async (ctx) => {
  const siteInfo = {
    title: 'hotchcms',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站'
  };
  await ctx.render('default/default-0/list', { siteInfo, alias: '/themes/default' });
};

exports.page = async (ctx) => {
  const siteInfo = {
    title: 'page',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站'
  };
  await ctx.render('default/template', { siteInfo });
};

exports.category = async (ctx) => {
  const siteInfo = {
    title: 'category',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站'
  };
  await ctx.render('default/template', { siteInfo });
};

exports.content = async (ctx) => {
  const siteInfo = {
    title: 'content',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站'
  };
  await ctx.render('default/template', { siteInfo });
};

exports.notFound = async (ctx) => {
  const siteInfo = {
    title: 'notFound',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站'
  };
  await ctx.render('default/template', { siteInfo });
};