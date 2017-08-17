exports.notFound = async (ctx, next) => {
  await ctx.render('default/index', { title: 404 });
};