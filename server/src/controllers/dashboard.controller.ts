import { BaseContext } from 'koa'
import path from 'path'
import { Summary, Tag, request, Prefix } from '@koa-lite/controller'
import { readFile } from '../utils'

@Tag('首页')
@Prefix('/dashboard')
export class Dashboard {
  @request.get('/')
  @Summary('首页数据')
  async sms(ctx: BaseContext) {
    const dataStr = await readFile(path.join(__dirname, '../assets/dashboard.json'))
    ctx.done(JSON.parse(dataStr.toString()))
  }
}
