import * as redis from '../db/redis'
import * as crypto from '../utils/crypto'
import sms from '../utils/sms'
import email from '../utils/email'
import oss from '../utils/oss'
import jwt from '../utils/jwt'
import wechat from '../utils/wechat'
import lbs from '../utils/lbs'
import Throw from '../utils/throw'

export default class Utils {
  /**
   * 随机数
   * @param  {Number} length [长度]
   * @return {String}
   */
  _random(length: number = 1): string {
    const base = Math.floor(Math.random() * Math.pow(10, length))
    return (`0000000000000000${base}`).substr(-length)
  }

  /**
   * 加密
   */
  _crypto = crypto

  /**
   * 密码处理
   */
  _password = {
    compare (pwd: string, pwdTrue: string): boolean {
      return crypto.sha1(pwd) === pwdTrue
    }
  }

  /**
   * 邮件
   */
  _email = email

  /**
   * 短信
   */
  _sms = sms

  /**
   * 阿里云
   */
  _oss = oss

  /**
   * JWT
   */
  _jwt = jwt

  /**
   * 微信
   */
  _wechat = wechat

  /**
   * 位置 
   */
  _lbs = lbs

  /**
   * 缓存
   */
  _redis = redis

  /**
   * 抛出
   */
  _throw = Throw
  
}