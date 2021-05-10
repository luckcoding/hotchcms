// mongodb
export const DB_PATH = 'mongodb://localhost:27017/hotchcms'

/**
 * mysql
 */
 export const MYSQL = {
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456..',
  database: 'hotchcms',
}

export const REDIS = {
  host: 'localhost',
  port: 6379,
  db: '4',
  family: 'IPv4',
  password: undefined,
}

/**
 * 系统配置信息
 */
export const SYSTEM = {
  port: 3030, // listen
  threshold: 300, // 请求耗时超过多少写入logger
  secret: 'hotchcms', // 加密盐值
}

/**
 * jwt
 */
export const JWT = {
  secret: 'hotchcms',
  expiresIn: 24 * 60 * 60 * 30, // token 失效时间一个月
}

/**
 * 阿里云oss
 */
export const OSS = {
  id: '',
  secret: '',
  host: '',
  dir: '',
}

/**
 * 腾讯企业邮箱
 */
export const EMAIL = {
  host: '',
  port: 465,
  user: '',
  pass: '',
  expiresIn: 5, // 5分钟
}

/**
 * 微信
 */
export const WECHAT = {
  // 小程序信息
  APPLETS: {
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    appid: '',
    secret: '',
  }
}

/**
 * 腾讯云短信
 */
export const SMS = {
  appid: 1,
  appkey: 'appkey',
  templateId: 1,
  sign: 'sign',
  expiresIn: 60 * 5 // 5分钟
}

/**
 * 腾讯lbs
 */
export const LBS = {
  url: 'http://apis.map.qq.com',
  key: '',
  secret: '',
}
