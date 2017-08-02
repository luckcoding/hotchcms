const Router = require('koa-router');
const contentCategory = require('../controllers/content-category.controller');
const adminAccount = require('../controllers/admin-account.controller');
const config = require('../config/system.config');

const router = new Router();
const source = 'content-category';

router.prefix(`/${config.API}/${source}`);

router.all('*', adminAccount.check); // 检查登录

router.post('/', contentCategory.create); // 新增分类
router.put('/:_id', contentCategory.update); // 更新分类
router.get('/', contentCategory.list); // 查询所有分类
router.get('/:_id', contentCategory.one); // 查询分类
router.delete('/:_id', contentCategory.delete); // 删除分类

module.exports = router;