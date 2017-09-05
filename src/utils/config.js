const APIV1 = 'http://localhost:3030/api'

const config = {
  name: 'Hotchcms',
  prefix: 'HotchCMS',
  footerText: 'Ant Design Admin  © 2017 zuiidea',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:3030'],
  openPages: ['/login', '/admin/login', '/install', '/admin/install'],
  routePrefix: '/admin',
  apiPrefix: '/api/v1',
  api: {
    signIn: `${APIV1}/admin-account/sign-in`, // 登录
    signOut: `${APIV1}/admin-account/sign-out`, // 注册
    captcha: `${APIV1}/common/captcha`, // 验证码
    current: `${APIV1}/admin-account`, // 获取当前用户
    dashboard: `${APIV1}/dashboard`,
    adminUser: `${APIV1}/admin-user/:_id`, // 管理员
    adminGroup: `${APIV1}/admin-group/:_id`, // 管理组
    category: `${APIV1}/category/:_id`, // 分类
    categories: `${APIV1}/category/multi`, // 分类

    install: `${APIV1}/install`, // 安装
    testDatabase: `${APIV1}/install/test-database`, // 检测数据裤
    testRedis: `${APIV1}/install/test-redis`, // 检测redis
  },
}

if (process.env.NODE_ENV === 'production') {
  config.iconFontCSS = config.routePrefix + config.iconFontCSS
  config.iconFontJS = config.routePrefix + config.iconFontJS
  config.logo = config.routePrefix + config.logo
}

module.exports = config
