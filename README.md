# Hotchcms

使用koa, mongodb 开发一套内容管理系统，旨在学习。

## 环境

* **node ^7.0.0**
* npm ^4.0.0
* mongodb ^3.0.0

## Run

1. `$ git clone https://github.com/luckcoding/hotchcms.git`
2. `$ npm install`
3. `$ npm start` or `npm run dev`

## 设计

```sh
├── bin                                 # 数据库初始化目录
│   └── www                             # 初始化入口文件
├── package.json
├── config/                             # 配置目录
├── server                              # 后端代码目录
│   ├── app.js                          # 后端服务入口文件
│   ├── codes/                          # 提示语代码目录
│   ├── controllers/                    # 操作层目录
│   ├── models/                         # 数据模型model层目录
│   ├── routers/                        # 路由目录
│   ├── services/                       # 业务层目录
│   ├── lib/                            # 工具类目录
│   ├── middleware/                     # 中间键
│   └── utils/                          # 工具类目录
└── public                              # 前端静态代码目录
    ├── admin                           # 管理平台
    ├── themes                          # 客户端主题
    │   ├── default/                    # 默认主题
    │   └── others/
    ├── plugins/                        # 通用插件
    └── media                           # 资源文件
        ├── image                       # 图片
        ├── doc                         # 文档
        ├── video                       # 视频
        └── other                       # 其他
```

## 更新

### 2017-03-22

* 支持检测数据库
* 支持初始化数据库
* 测试验证码模块
* 支持管理员登录、退出
* 需手动配置mongo