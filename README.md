# Hotchcms

使用koa, mongodb 开发一套内容管理系统，旨在学习。

## 环境

* **node ^6.0.0**
* npm ^4.0.0
* mongodb ^3.0.0

## Run

1. `$ git clone https://github.com/luckcoding/hotchcms.git`
2. `$ npm install`
3. `$ npm run dev`

## 设计

```sh
├── bin                                 # 数据库初始化目录
│   └── www                             # 初始化入口文件
├── public                              # 管理台静态资源目录
├── server                              # 后端工程目录
│   ├── config/                         # 配置目录
│   ├── controllers/                    # 操作层目录
│   ├── lib/                            # 公用类目录
│   ├── middleware/                     # 中间键
│   ├── models/                         # 数据模型model层目录
│   ├── services/                       # 业务层目录
│   ├── utils/                          # 工具类目录
│   ├── routes                          # 路由表
│   └── app.js                          # 后端服务入口文件
├── src                                 # 管理台代码目录
│   ├── components                      # 组件
│   ├── models                          # dva模型
│   ├── routes                          # 路由配置
│   ├── services                        # 服务类
│   ├── themes                          # 主题配色
│   ├── utlis                           # 工具类
│   ├── index.html
│   ├── index.js                        # 项目入口
│   ├── router.js                       # 路由入口
│   └── theme.config.js                 # 主题配置
├── publish                             # 前端静态代码目录
│   ├── admin                           # 管理平台
│   ├── themes                          # 客户端主题
│   │   ├── default/                    # 默认主题
│   │   └── others/
│   ├── plugins/                        # 通用插件
│   └── media                           # 资源文件
│       ├── image                       # 图片
│       ├── doc                         # 文档
│       ├── video                       # 视频
│       └── other                       # 其他
├── .babelrc                            # 后端es7支撑
├── .editorconfig                       # 管理台代码规范
├── .eslintrc                           # 管理台码规范
└── .roadhogrc.js                       # 管理台编译配置
```

## 更新

### 2017-08-24

* del koa-jwt
* 初始化 ejs 前端框架
* 增加内容分类
* 优化一些代码
* 修复一些bug

### 2017-08-6

* cookie => jwt
* 增加redis缓存
* 路由优化
* 权限优化
* 修复一些bug

### 2017-06-28

* 增加权限模块
* 增加管理台工程
* 优化项目目录
* 修复一些bug

### 2017-04-9

* 增加管理员模块
* 增加管理员组模块
* 支持站点信息查询

### 2017-03-22

* 支持检测数据库
* 支持初始化数据库
* 测试验证码模块
* 支持管理员登录、退出
* 需手动配置mongo