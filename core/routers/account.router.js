const Router = require('koa-router');
const account = require('../controllers/account.controller');
const config = require('../config/router.config');

const router = new Router();
const source = 'account';

router.prefix(`/${config.API}/${source}`);

router.all('/', account.check); // 登录状态
router.get('/', account.current);
router.put('/', account.update);

router.get('/captcha', account.captcha);
router.put('/sign-in', account.signIn);
router.put('/sign-out', account.signOut);

module.exports = router;