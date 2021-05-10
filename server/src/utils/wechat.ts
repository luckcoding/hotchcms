import request from 'request'
import { WECHAT } from '../config'

const { appid, secret, url } = WECHAT.APPLETS

export class Wechat {
  /**
   * 换取 opendid
   * @param {String} code
   */
  static async getOpenId (code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const qs = {
        appid,
        secret,
        js_code: code,
        grant_type: 'authorization_code',
      }
      request({ url, qs }, (err, { body }) => {
        if (err) return reject(err)
        const { openid } = JSON.parse(body)
        openid ? resolve(openid) : reject()
      })
    })
  }
}
