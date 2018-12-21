module.exports = {
  cms: {
    title: 'hotchcms', // 系统名称
    email: '1@qq.com', // 超级管理员后台登录账号
    password: '9eb1028e2c3cd5c9e69a3e237c3b4dfb', // 密码加盐值进行32位小写md5, md5('123456' + $secret)
  },

  mongodb: {
    host: 'localhost',
    port: 27017,
    db: 'hotchcms',
    user: '',
    pass: '',
  },

  redis: {
    host: 'localhost',
    port: 6379,
    db: '10',
    family: 'IPv4',
    pass: '',
  },

  /**
   * =======================================
   * 系统配置信息
   */
  system: {
    port: 3030, // 服务默认端口
    effect: 300, // 请求耗时超过多少写入logger
    secret: 'hotchcms', // 后台加密盐值
    expiresIn: 24 * 60 * 60, // token 失效时间 一天
    expiresInLong: 24 * 60 * 60 * 30, // token 失效时间 一月
  },

  /**
   * 一些全局静态变量
   */
  static: {
    SYSTEM_CATEGORIES: 'SYSTEM_CATEGORIES',
  },
}
