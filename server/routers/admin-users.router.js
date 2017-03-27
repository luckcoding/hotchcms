const Router = require('koa-router');
const adminUsers = require('../controllers/admin-users.controller');
const config = require('../../config/router.config');

const router = new Router();
const source = 'admin-users';

router.prefix(`/${config.API}/${source}`);

// router.all('/', account.check); // 登录状态
router.get('/:_id', adminUsers.one);

module.exports = router;