const path = require('path');
const _ = require('lodash');
const Router = require('koa-router');
const requireAll = require('require-all');
const routes = require('../routes');

const router = new Router();
const filter = new Router();

/**
 * 读取控制器
 */
const controllers = requireAll({
  dirname: path.join(__dirname, '../controllers/'),
  filter: /(.+)\.controller\.js$/
});

/**
 * 递归绑定控制器
 * @param  {[type]} map   [description]
 * @param  {[type]} route [description]
 * @return {[type]}       [description]
 */
(function loop (map, route) {
  route = route || '';

  _.forEach(map, (value, key) => {

    if (_.isObject(value) && !_.isArray(value)) {
      // { '/path': { ... }}
      loop(value, route + key);
    } else {
      let controller;
      let action;

      if (_.isString(value)) {
        // 'controller.action'
        controller = value.split('.')[0];
        action = value.split('.')[1];
        mixin(filter);
        mixin(router);
      } else if (_.isArray(value)) {
        // ['controller.action']
        if (!_.isEmpty(value)) {
          controller = value[0].split('.')[0];
          action = value[0].split('.')[1];
          mixin(router);

          key = 'all';
          controller = 'admin-account';
          action = 'check';
          mixin(router);
        }
      }

      function mixin(todo) {
        if (action) {
          todo[key](route, controllers[controller][action]);
        } else if (controller) {
          todo[key](route, controllers[controller]);
        }
      }
    }
  });
})(routes);

module.exports = router;
module.exports.filter = filter;