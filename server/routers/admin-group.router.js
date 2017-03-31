const Router = require('koa-router');
const adminGroup = require('../controllers/admin-group.controller');
const config = require('../../config/router.config');

const router = new Router();
const source = 'admin-group';

router.prefix(`/${config.API}/${source}`);

router.all('/', adminUser.check); // 检查登录

router.post('/', adminUser.create); // 新增用户组
router.put('/', adminUser.update); // 更新账号
// router.get('/', adminUser.list); // 查询所有用户组
// router.get('/:_id', adminUser.one); // 查询用户组
// router.put('/:_id', adminUser.update); // 更新用户组
// router.delete('/:_id', adminUser.one); // 删除用户组

module.exports = router;