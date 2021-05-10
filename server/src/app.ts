import 'reflect-metadata'
import Koa from 'koa'
import http from 'http'
import cors from '@koa/cors'
import koaBody from 'koa-body'
import koaJwt from 'koa-jwt'
import pipe from './middlewares/pipe'
import { logger } from './utils'
import { SYSTEM, JWT } from './config'
import { router } from './router'
import './db/mongodb'

const app = new Koa()

// 跨域
app.use(cors())

// 请求解析
app.use(koaBody())

// jwt
app.use(koaJwt({
  secret: JWT.secret,
  passthrough: true
}).unless({
  path: [/^\/docs/]
}))

app.use(pipe()) // 通讯

// 路由
app.use(router.routes())

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
