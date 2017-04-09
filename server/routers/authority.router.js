const Router = require('koa-router');
const authority = require('../controllers/authority.controller');
const config = require('../../config/router.config');

const router = new Router();
const source = 'authority';

router.prefix(`/${config.API}/${source}`);

router.get('/', authority.one); // 查询权限列表


module.exports = router;