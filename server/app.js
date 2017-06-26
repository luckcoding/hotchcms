const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const convert = require('koa-convert');
const favicon = require('koa-favicon');
const koaStatic = require('koa-static');
const cors = require('kcors');
// const views = require('koa-views');

const logger = require('./lib/logger.lib');
// const router = require('./lib/routers');
const session = require('./lib/session.lib');

const routers = require('./routers');

const validation = require('./middleware/validation.middleware');
const pipe = require('./middleware/pipe.middleware');
const authority = require('./middleware/authority.middleware');

global.Promise = require('bluebird');

const app = new Koa();
app.jsonSpaces = 0 // 压缩json返回中的空格
app.keys = ['key'];

// favicon
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cors({
  credentials: true
}));

// request parse
app.use(convert(bodyParser()));
app.use(convert(json()));

// http 日志
app.use(logger.http());

// session
app.use(convert.compose(
  session.check(),
  session.init()
));

// middleware
app.use(convert.compose(
  authority(), // 权限验证
  validation(), // 验证参数
  pipe() // pipe通讯
));

// static
app.use(convert(koaStatic(path.join(__dirname, 'public'))));

// app.use(views(path.join(__dirname, 'public/themes'), {
//   extension: 'ejs'
// }))

// 日志
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  logger.app().info(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

// // 转给 Roter 处理路由
// app.use(router.routes())
// app.use(router.allowedMethods({
//   throw: true
// }))
routers(app);

// 监听错误
app.on('error', (err, ctx) => {
  logger.app().error('服务错误: ', err, ctx)
});

// export default app;
module.exports = app;