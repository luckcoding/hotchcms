import { base64 } from './crypto'
import { OSS } from '../config'

export interface SignInfoType {
  id: string,
  host: string,
  policy: string
  signature: string
  dir: string
}

export default class Oss {
  /**
   * 获取签名信息
   * @return {Object}
   */
  static getSignInfo(): SignInfoType {
    const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // 24h

    const conditions = [
      ['content-length-range', 0, 104857600], // 100M
    ]
    const policyStr = JSON.stringify({ expiration, conditions })
    const policy = Buffer.from(policyStr).toString('base64')

    const signature = base64(policy, OSS.secret)

    return { id: OSS.id, host: OSS.host, policy, signature, dir: OSS.dir, }
  }
}