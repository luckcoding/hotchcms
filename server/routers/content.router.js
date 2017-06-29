const Router = require('koa-router');
const content = require('../controllers/content.controller');
const adminAccount = require('../controllers/admin-account.controller');
const config = require('../config/router.config');

const router = new Router();
const source = 'content';

router.prefix(`/${config.API}/${source}`);

router.all('*', adminAccount.check); // 检查登录

router.post('/', content.create); // 新增分类

module.exports = router;