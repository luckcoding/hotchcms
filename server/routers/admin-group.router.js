const Router = require('koa-router');
const adminGroup = require('../controllers/admin-group.controller');
const adminAccount = require('../controllers/admin-account.controller');
const config = require('../config/system.config');

const router = new Router();
const source = 'admin-group';

router.prefix(`/${config.API}/${source}`);

router.all('*', adminAccount.check); // 检查登录

router.post('/', adminGroup.create); // 新增用户组
router.put('/:_id', adminGroup.update); // 更新用户组
router.get('/', adminGroup.list); // 查询所有用户组
router.get('/:_id', adminGroup.one); // 查询用户组
router.delete('/:_id', adminGroup.delete); // 删除用户组

module.exports = router;