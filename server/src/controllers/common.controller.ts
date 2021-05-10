import { BaseContext } from 'koa'
import { isUser } from '../middlewares/auth'
import { Summary, Tag, request, Middle, check } from '@koa-lite/controller'
import { Joi, joiSchema, Lbs, Oss, random, sms } from '../utils'

@Tag('通用模块')
export class Common {
  @request.get('/sms')
  @check.query(Joi.object({
    phone: joiSchema.phone,
    type: joiSchema.codeType,
  }))
  @Summary('发送短信')
  async sms(ctx: BaseContext) {

    const { phone, type } = await ctx.payload()
    const code = random(4)
    await sms.sendCode({ phone, code, type })

    ctx.done({ phone, code, type })
  }

  @request.get('/oss')
  @Summary('获取阿里云通证')
  @Middle([ isUser('user') ])
  async oss(ctx: BaseContext) {
    ctx.done(Oss.getSignInfo())
  }

  @request.get('/geocoder')
  @Summary('逆地址解析')
  @check.query(Joi.object({
    lat: Joi.string().required().description('经度'),
    lng: Joi.string().required().description('经度'),
  }))
  async geocoder(ctx: BaseContext) {
    const { lat, lng } = await ctx.payload()
    ctx.done(await Lbs.geocoder(lat, lng))
  }
}
