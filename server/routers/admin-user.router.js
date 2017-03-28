const Router = require('koa-router');
const adminUser = require('../controllers/admin-user.controller');
const config = require('../../config/router.config');

const router = new Router();
const source = 'admin-user';

router.prefix(`/${config.API}/${source}`);

router.all('/', adminUser.check); // 登录状态

router.get('/', adminUser.current);
router.put('/', adminUser.update);
router.post('/', adminUser.create);

// router.get('/:_id', adminUser.one);
// router.get('/list', adminUser.list);

router.put('/sign-in', adminUser.signIn);
router.put('/sign-out', adminUser.signOut);


module.exports = router;