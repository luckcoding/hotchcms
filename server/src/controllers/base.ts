import { BaseContext } from 'koa'
import Utils from './_utils'
import { CodeTypes } from '../constants'
import { isUser } from '../middleware/auth'
import { Group, Request, Query, Middlewares, Summary } from '../utils/decorator'

@Group('通用模块')
export default class Base extends Utils {
  @Request('GET', '/sms')
  @Query({
    phone: { notEmpty: true, isPhone: true, description: '手机号' },
    type: { notEmpty: true, isIn: { options: [CodeTypes] }, description: '类型' },
  })
  @Summary('发送短信')
  async sms(ctx: BaseContext) {

    const { phone, type } = await ctx.payload()
    const code = this._random(4)
    await this._sms.sendCode({ phone, code, type })

    ctx.done({ phone, code, type })
  }

  @Request('GET', '/oss')
  @Summary('获取阿里云通证')
  @Middlewares([ isUser ])
  async oss(ctx: BaseContext) {
    ctx.done(this._oss.getSignInfo())
  }

  @Request('GET', '/geocoder')
  @Summary('逆地址解析')
  @Query({
    lat: { notEmpty: true, isString: true, description: '经度' },
    lng: { notEmpty: true, isString: true, description: '纬度'},
  })
  async geocoder(ctx: BaseContext) {
    const { lat, lng } = await ctx.payload()
    ctx.done(await this._lbs.geocoder(lat, lng))
  }
}