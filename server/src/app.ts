import 'reflect-metadata'
import Koa from 'koa'
import http from 'http'
import path from 'path'
import cors from '@koa/cors'
import koaBody from 'koa-body'
import koaJwt from 'koa-jwt'
import valid from './middleware/valid'
import pipe from './middleware/pipe'
import logger from './utils/logger'
import { SYSTEM, JWT } from './config'
import router from './router'
import render from 'koa-ejs'
import './db/mongodb'

const app = new Koa()

render(app, {
  root: path.join(__dirname, './static'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true,
})

// 跨域
app.use(cors())

// 请求解析
app.use(koaBody())

// jwt
app.use(koaJwt({
  secret: JWT.secret,
  passthrough: true
}).unless({
  path: [/^\/apidocs/]
}))

app.use(valid()) // 参数验证
app.use(pipe()) // 通讯

// 路由
app
  .use(router.base)
  // .use(router.v1)
  .use(router.admin)

// 404
app.use(ctx => {
  ctx.status = 404
  ctx.body = '请求的API地址不正确或者不存在'
})

// 监听错误
app.on('error', (err, ctx) => {
  logger.error('服务错误: ', err, ctx)
})

/**
 * 创建服务
 */
const server = http.createServer(app.callback());

server.on('error', (error) => {
  logger.error('启动失败: ', error)
})

server.on('listening', () => {
  logger.info(`服务启动, 端口: ${SYSTEM.port}`)
})

if (!module.parent) {
  server.listen(SYSTEM.port)
}