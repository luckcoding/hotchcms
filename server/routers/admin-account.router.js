const Router = require('koa-router');
const adminAccount = require('../controllers/admin-account.controller');
const config = require('../../config/router.config');

const router = new Router();
const source = 'admin-account';

router.prefix(`/${config.API}/${source}`);

router.all('/', adminAccount.check); //登录状态
router.get('/', adminAccount.current); //查询
router.put('/', adminAccount.update); // 更新

router.put('/sign-in', adminAccount.signIn); //登录
router.put('/sign-out', adminAccount.signOut); //退出


module.exports = router;