import Koa from 'koa'
import { logger, SBError } from '../utils'
import { SYSTEM } from '../config'
import { MsgCode, MsgCodeType } from '../constants'
import { CheckError } from '@koa-lite/controller'

declare module 'koa' {
  export interface BaseContext {
    done: (ret?: any) => void
    fail: (code: MsgCodeType, msg?: string) => void
  }
}

const pipe = () => async (ctx: Koa.Context, next:() => Promise<any>) => {
  try {
    // 通讯超时处理
    ctx._effect = {
      start: Date.now(),
      end() {
        const ms = Date.now() - this.start
        const level = ms > SYSTEM.threshold ? 'warn' : 'log'
        logger[level](`${ctx.method} ${ctx.url} - ${ms}ms`)
      }
    }

    // 返回
    ctx.done = ret => ctx.body = { code: MsgCode.SUCCESS.code, ret }

    await next()
  } catch (err) {
    if (err instanceof SBError) {
      ctx.body = err.getError()
    } else if (err instanceof CheckError) {
      ctx.body = {
        code: MsgCode.VALIDATE_FAIL.code,
        msg: err.error.details[0].message
      }
    } else {
      ctx.status = err.status || 500
      ctx.body = err.message
      if (ctx.status === 500) {
        // 只记录服务器错误
        ctx.app.emit('error', err, ctx)
      }
    }
  } finally {
    ctx._effect.end()
  }
}

export default pipe
