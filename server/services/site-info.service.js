const cache = require('../lib/cache.lib');
const Options = require('../models/options.model');

/**
 * 获取网站信息
 * @param  {[type]} ) [description]
 * @return {[type]}   [description]
 */
exports.get = () => new Promise(async (resolve, reject) => {
  const siteInfoCache = await cache.get('SYSTEM_SITEINFO');
  if (siteInfoCache) return resolve(siteInfoCache);
  try {
    const siteInfo = await Options.findOne({ name: 'siteInfo' });
    await cache.set('SYSTEM_SITEINFO', siteInfo.value, 1000 * 60 * 60 * 24 * 30);
    resolve(siteInfo.value);
  } catch (e) {
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
    await Options.findOneAndUpdate({ name: 'siteInfo' },{ value: options.data },{ runValidators: true });
    await cache.del('SYSTEM_SITEINFO');
    resolve();
  } catch (e) {
    e.type = 'database';
    reject(e);
  };
});