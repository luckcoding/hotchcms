const Koa = require('koa');
const path = require('path');
const koaBody = require('koa-body');
const convert = require('koa-convert');
const favicon = require('koa-favicon');
const koaStatic = require('koa-static');
const cors = require('kcors');
const views = require('koa-views');

const logger = require('./lib/logger.lib');

const validation = require('./middleware/validation.middleware');
const pipe = require('./middleware/pipe.middleware');
const authority = require('./middleware/authority.middleware');

const config = require('./config/system.config');

const route = require('./lib/route.lib');
const Throw = require('./lib/error.lib');

global.Promise = require('bluebird');
global.Throw = Throw;

const app = new Koa();
app.jsonSpaces = 0; // 压缩json返回中的空格
app.keys = ['key'];

// favicon
app.use(favicon(__dirname + '../public/favicon.ico'));
app.use(cors({
  credentials: true
}));

// 请求解析
app.use(convert(koaBody({
  multipart: true
})));

// 日志
app.use(logger.http());

// middleware
app.use(convert.compose(
  authority(route), // 权限验证
  validation(), // 验证参数
  pipe() // 通讯
));

// 静态文件
app.use(convert(koaStatic(path.join(__dirname, '../publish/'))));

// 渲染引擎
// app.use(views(path.join(__dirname, '../publish/themes'), {
//   extension: 'ejs'
// }));

// 日志
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  logger.app().info(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

// 路由
app.use(route.routes())
app.use(route.allowedMethods({
  throw: true
}));

// 监听错误
app.on('error', (err, ctx) => {
  logger.app().error('服务错误: ', err, ctx)
});

module.exports = app;