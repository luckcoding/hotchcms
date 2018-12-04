module.exports = {
  '/api': {
    '/install': {
      get: 'install.status', // 安装状态
      post: 'install.install', // 安装

      '/test-database': {
        put: 'install.testDatabase', // mongodb 连接测试
      },

      '/test-redis': {
        put: 'install.testRedis', // redis 连接测试
      },
    },

    '/admin-account': {
      get: '*admin-account.current#【当前账号】查询',
      put: '*admin-account.update#【当前账号】更新',

      '/sign-in': {
        put: 'admin-account.signIn', // 登录
      },

      '/sign-out': {
        put: '*admin-account.signOut#退出',
      },
    },

    '/admin-group': {
      post: '*admin-group.create#【管理组】新增',
      get: '*admin-group.list#【管理组】查询',


      '/multi': {
        post: '*admin-group.multi#【用户组】多项操作',
        get: '*admin-group.all#【用户组】查询所有',
      },

      '/:_id': {
        put: '*admin-group.update#【管理组】更新',
        get: '*admin-group.one#【管理组】列表',
        delete: '*admin-group.delete#【管理组】删除',
      },
    },

    '/admin-user': {
      post: '*admin-user.create#【管理员】新增',
      get: '*admin-user.list#【管理员】列表',

      '/multi': {
        post: '*admin-user.multi#【管理员】多条操作',
      },

      '/:_id': {
        put: '*admin-user.update#【管理员】更新',
        get: '*admin-user.one#【管理员】查询',
        delete: '*admin-user.delete#【管理员】删除',
      },
    },

    '/category': {
      post: '*category.create#【分类】新增',
      get: '*category.list#【分类】查询',

      '/multi': {
        post: '*category.multi#【分类】多条操作',
      },

      '/:_id': {
        put: '*category.update#【分类】更新',
        get: '*category.one#【分类】列表',
        delete: '*category.delete#【分类】删除',
      },
    },

    '/content': {
      post: '*content.create#【文章】创建',
      get: '*content.list#【文章】列表',

      '/multi': {
        post: '*content.multi#【文章】多项操作',
      },

      '/:_id': {
        put: '*content.update#【文章】更新',
        get: '*content.one#【文章】详情',
        delete: '*content.delete#【文章】删除',
      },
    },

    '/authority': {
      get: '*authority.list#【权限】列表',
    },

    '/media': {
      post: '*media.create#【文件】上传',
      get: '*media.list#【文件】列表',
    },


    '/v1': {
      '/categories': {
        get: 'v1.getCategories#【网站】获取分类',
      },
      '/contents': {
        get: 'v1.getContents#【网站】获取文章列表'
      }
    }
  },
}
