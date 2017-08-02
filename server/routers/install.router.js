const Router = require('koa-router');
const install = require('../controllers/install.controller');
const config = require('../config/system.config');

const router = new Router();
const source = 'install';

router.prefix(`/${config.API}/${source}`);

router.get('/', install.status);
router.post('/', install.install);
router.put('/test-database', install.testDatabase);

module.exports = router;