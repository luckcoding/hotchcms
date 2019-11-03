import R from 'ramda'
import Koa from 'koa'
import Throw from '../utils/throw'
import logger from '../utils/logger'
import { SYSTEM } from '../config'
import { DoneType, FailType } from '../constants'

interface AnyJsonType {
  [key: string]: any
}

interface PagesPayloadType {
  query: AnyJsonType;
  pages: {
    page: number;
    pageSize: number;
  }
}

declare module 'koa' {
  export interface BaseContext {
    done: (ret?: any) => void
    fail: (msg?: string, code?: FailType) => void
    payload: () => Promise<AnyJsonType>
    checkPages: (queryModel: AnyJsonType) => Promise<PagesPayloadType>
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
    ctx.done = (ret: any) => ctx.body = { code: DoneType.ok, ret }
    ctx.fail = (msg: string = 'unknow', type: FailType = FailType.unknow) => {
      throw Throw(msg, type)
    }

    // 获取请求体
    ctx.payload = async () => {
      try {
        const payload = R.merge(
          await ctx.getValidationLegalResult(),
          await ctx.getSanitizerLegalResult()
        )

        // filter undefined
        return R.omit(Object.keys(payload).filter(_ => !payload[_]), payload)
      } catch (error) {
        throw Throw(error, FailType.validErr)
      }
    }

    // 检查分页信息
    ctx.checkPages = async (queryModel: AnyJsonType = {}): Promise<PagesPayloadType> => {
      ctx.sanitizeQuery('page').toInt()
      ctx.sanitizeQuery('pageSize').toInt()
      queryModel && ctx.checkQuery(queryModel)
      const { page, pageSize, ...query } = await ctx.payload()
      return { query, pages: { page, pageSize } }
    }

    await next()
  } catch (err) {
    if (typeof err !== 'object') {
      ctx.body = { code: FailType.flowErr, msg: err }
    } else if (err.code) {
      ctx.body = { code: err.code, msg: err.message }
    } else {
      ctx.status = err.status || 500
      ctx.body = err.message
      if (ctx.status === 500) {
        ctx.app.emit('error', err, ctx)
      }
    }
  } finally {
    ctx._effect.end()
  }
}

export default pipe