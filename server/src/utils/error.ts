import { MsgCode, MsgCodeType } from '../constants'

export class SBError extends Error {
  public code: number
  public msg?: string
  public stack: any

  constructor(key: MsgCodeType, msg?: string) {
    super()
    const map = MsgCode[key]
    this.code = map.code
    this.msg = msg || map.msg || 'unknown'
    Error.captureStackTrace(this, SBError)
  }

  public getError() {
    return { code: this.code, msg: this.msg }
  }
}
