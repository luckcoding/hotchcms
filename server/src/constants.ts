import { values } from 'ramda'

export const enum DoneType {
  ok = '0', // 成功
}

export const enum FailType {
  tokenErr = 'TK99', // Token失效
  validErr = 'VD99', // 验证错误
  roleErr = 'RO99', // 权限错误
  flowErr = 'FL99', // 流程出错
  unknow = '9999', // 未知错误
}

// 验证码类型
export enum CodeType {
  register = 'register',
  login = 'login',
}
export const CodeTypes = values(CodeType)

// 错误类型
export enum ThrowType {
  system = 'system',
  database = 'database',
  business = 'business',
  validate = 'validate'
}
export const ThrowTypes = values(ThrowType)