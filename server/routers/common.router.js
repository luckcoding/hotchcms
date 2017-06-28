const Router = require('koa-router');
const common = require('../controllers/common.controller');
const config = require('../config/router.config');

const router = new Router();
const source = 'common';

router.prefix(`/${config.API}/${source}`);

router.get('/captcha', common.captcha);

module.exports = router;