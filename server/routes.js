module.exports = {
  '/api': {
    '/install': {
      get: 'install.status', // 安装状态
      post: 'install.install', // 安装

      '/test-database': {
        put: 'install.testDatabase' // 链接测试
      }
    },

    '/site-info': {
      get: ['site-info.get'], // 获取站点信息
      // put: [110101, 'site-info.update']
    },

    '/admin-account': {
      get: ['admin-account.current'], // 查询当前账号
      put: ['admin-account.update'], // 更新当前账号

      '/sign-in': {
        put: 'admin-account.signIn' // 登录
      },

      '/sign-out': {
        put: ['admin-account.signOut'] // 退出
      }
    },

    '/admin-group': {
      post: ['admin-group.create'], // 新增用户组
      get: ['admin-group.list'], // 查询所有用户组

      '/:_id': {
        put: ['admin-group.update'], // 更新用户组
        get: ['admin-group.one'], // 查询用户组
        delete: ['admin-group.delete'] // 删除用户组
      }
    },

    '/admin-user': {
      post: ['admin-user.create'], // 新增账号
      get: ['admin-user.list'], // 查询所有账号

      '/:_id': {
        put: ['admin-user.update'], // 更新账号
        get: ['admin-user.one'], // 查询账号
        delete: ['admin-user.delete'] // 删除账号
      }
    },

    '/category': {
      post: ['category.create'], // 新增分类
      get: ['category.tree'], // 查询分类树

      '/:_id': {
        put: ['category.update'], // 更新分类
        get: ['category.one'], // 查询分类
        delete: ['category.delete'] // 删除分类
      }
    },

    '/theme': {
      get: ['theme.test']
    },

    '/authority': {
      get: ['authority.list'] // 权限列表
    },
  },

  '(\^/|^\/index.html|^\/index.htm)': { get: 'render.home' }, // 首页

  '/page-(.*).htm(l*)': { get: 'render.page' }, // 单页

  '/category/:_id': { get: 'render.category' }, // 分类列表

  '/category/:_id/content/:_id': { get: 'render.content' }, // 分类详情

  '/*': { get: 'render.notFound' }, // 404
};