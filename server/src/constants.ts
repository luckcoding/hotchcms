import { values } from 'ramda'

// 文章状态
export enum ArticleStatusType {
  draft = 'draft',
  published = 'published',
  offlined = 'offlined',
  recycled = 'recycled'
}
export const ArticleStatusTypes = values(ArticleStatusType)

// 文章来源
export enum ArticleFromType {
  third = 'third', // 转载
  official = 'official', // 编辑(adminUser)
  user = 'user', // 用户(User)
}
export const ArticleFromTypes = values(ArticleFromType)

// 验证码类型
export enum CodeType {
  register = 'register',
  login = 'login',
}
export const CodeTypes = values(CodeType)

// 权限类型
export enum RoleType {
  root = 'root', // 超级管理员
  operator = 'operator', // 普通管理员
  user = 'user', // 普通用户
}
export const RoleTypes = values(RoleType)

/**
 * ========================================
 * code信息
 */
export const MsgCode = {
  SUCCESS: { code: 0, msg: '成功' },
  TOKEN_FAIL: { code: 1001, msg: '登录信息已过期' },
  WRONG_AUTHED: { code: 1002, msg: '用户名或密码错误' },
  NOT_EXIST: { code: 2000, msg: '不存在' },
  DUPLICATE: { code: 2001, msg: '重复' },
  DENIED: { code: 2002, msg: '请求被拒绝' },
  VALIDATE_FAIL: { code: 3000, msg: '参数错误' },
  INCORRECT: { code: 3001, msg: '内容有误' },
  OFTEN: { code: 4000, msg: '操作过于频繁' },
}

export type MsgCodeType = keyof typeof MsgCode
