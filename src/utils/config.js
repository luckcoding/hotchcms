const APIV1 = 'http://localhost:3030/api'

module.exports = {
  name: 'Hotchcms',
  prefix: 'HotchCMS',
  footerText: 'Ant Design Admin  © 2017 zuiidea',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:3030'],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  api: {
    signIn: `${APIV1}/admin-account/sign-in`, // 登录
    signOut: `${APIV1}/admin-account/sign-out`, // 注册
    captcha: `${APIV1}/common/captcha`, // 验证码
    current: `${APIV1}/admin-account`, // 获取当前用户
    dashboard: `${APIV1}/dashboard`,
    adminUser: `${APIV1}/admin-user/:_id`, // 用户

  },
}
