const logger = require('../lib/logger.lib');
const cache = require('../lib/cache.lib');
const optionsModel = require('../models/options.model');

/**
 * 获取网站信息
 * @param  {[type]} ) [description]
 * @return {[type]}   [description]
 */
exports.get = () => new Promise(async (resolve, reject) => {
  const siteInfoCache = cache.get('siteInfo');
  if (siteInfoCache) return resolve(siteInfoCache);

  try {
    const siteInfo = await optionsModel.findOne({ name: 'siteInfo' });
    cache.set('siteInfo', siteInfo.value, 1000 * 60 * 60 * 24 * 30);
    resolve(siteInfo.value);
  } catch (e) {
    e.type = 'database';
    reject(e);
  };
});

/**
 * 存储网站信息
 * @param  {[type]} ) [description]
 * @return {[type]}   [description]
 */
exports.save = () => new Promise(async (resolve, reject) => {
  try {
    await optionsModel.findOneAndUpdate({ name: 'siteInfo' },{ value: options.data },{ runValidators: true });
    cache.del('siteInfo');
    resolve();
  } catch (e) {
    e.type = 'database';
    reject(e);
  };
});