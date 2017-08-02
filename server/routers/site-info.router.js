const Router = require('koa-router');
const siteInfo = require('../controllers/site-info.controller');
const config = require('../config/system.config');

const router = new Router();
const source = 'site-info';

router.prefix(`/${config.API}/${source}`);

router.get('/', siteInfo.get);
// router.put('/', account.captcha);

module.exports = router;