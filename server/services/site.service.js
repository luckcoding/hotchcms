const _ = require('lodash');
const Category = require('../models/category.model');
const Options = require('../models/options.model');
const Theme = require('../models/theme.model');
const cache = require('../lib/cache.lib');

exports.SiteInfo = function () {
  return {
    async get() {
      const call = await cache.get('SYSTEM_SITEINFO');
      if (call) return call;
      const { value } = await Options.findOne({ name: 'siteInfo' });
      await cache.set('SYSTEM_SITEINFO', value, 1000 * 60 * 60 * 24 * 30);
      return value;
    },

    async set(value) {
      await Options.findOneAndUpdate({ name: 'siteInfo' }, { value }, { runValidators: true });
      await cache.del('SYSTEM_SITEINFO');
      return null;
    },
  }
}