
exports.list = async ctx => {
  const authorities = ctx.authorityModels || [];
  ctx.pipeDone(authorities);
};