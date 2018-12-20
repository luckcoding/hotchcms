module.exports = {
  API: 'api',
  secret: 'hotchcms',
  expiresIn: 24 * 60 * 60, // token 失效时间 默认一天
  expiresInLong: 24 * 60 * 60 * 30, // 一月

  server_port: 3030, // 服务默认端口
  http_effect: 300, // 请求耗时超过多少写入logger
}