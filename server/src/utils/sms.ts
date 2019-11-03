import QcloudSms from 'qcloudsms_js'
import { promisify } from 'util'
import * as Redis from '../db/redis'
import { SMS } from '../config'

const { appid, appkey, templateId, sign, expiresIn } = SMS

interface OptionsType {
  phone?: string | number
  code?: string | number
  type?: string
}

class Sms {
  sender: any
  codeSender: any

  constructor() {
    this.sender = QcloudSms(appid, appkey).SmsSingleSender() // 发送单条
    /**
     * 指定模板ID单发短信 promise util
     */
    this.codeSender = promisify(this.sender.sendWithParam).bind(this.sender)
  }

  // 发送
  async sendCode(options: OptionsType) {
    const { phone, code, type } = options
    await this.codeSender(86, phone, templateId, [code], sign, '', '')
    await Redis.set(`${phone}-${type}`, code, 'EX', expiresIn)
  }

  // 缓存值
  async getCode(options: OptionsType) {
    const { phone, type } = options
    return await Redis.get(`${phone}-${type}`)
  }

  // 验证
  async validCode(options: OptionsType): Promise<Boolean> {
    const { phone, code, type } = options

    const isEq = code === (await this.getCode(options))

    if (isEq) {
      await Redis.del(`${phone}-${type}`)
      return true
    } else {
      return false
    }
  }
}

export default new Sms()

