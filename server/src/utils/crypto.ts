import crypto from 'crypto'

/**
 * 进行 SHA1 加密
 * @param {String} value 原值
 * @return {String} SHA1 值
 */
export function sha1 (value: string): string {
  const sha1 = crypto.createHash('sha1')
  sha1.update(value)
  return sha1.digest('hex')
}

/**
 * 进行 MD5 加密
 * @param {String} value 原值
 * @return {String} MD5 值
 */
export function md5 (value: string): string {
  const md5 = crypto.createHash('md5')
  md5.update(value)
  return md5.digest('hex')
}

/**
 * 进行 base64 加密
 * @param {String} value 原值
 * @param {String} secret 秘钥
 * @return {String} BASE64 值
 */
export function base64 (value: string, secret: string): string {
  const base64 = crypto.createHmac('sha1', secret)
  base64.update(value)
  return base64.digest('base64')
}
