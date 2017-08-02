const Router = require('koa-router');
const adminUser = require('../controllers/admin-user.controller');
const adminAccount = require('../controllers/admin-account.controller');
const config = require('../config/system.config');

const router = new Router();
const source = 'admin-user';

router.prefix(`/${config.API}/${source}`);

router.all('*', adminAccount.check); // 检查登录

router.post('/', adminUser.create); // 新增账号
router.put('/:_id', adminUser.update); // 更新账号
router.get('/', adminUser.list); // 查询所有账号
router.get('/:_id', adminUser.one); // 查询账号
router.delete('/:_id', adminUser.delete); // 删除账号

module.exports = router;