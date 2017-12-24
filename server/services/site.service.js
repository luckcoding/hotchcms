const {
  Options,
  Theme,
} = require('../models')
const cache = require('../lib/cache.lib')

exports.ThemeInfo = () => {
  return {
    _default () {
      return Theme._default()
    },
  }
}

exports.SiteInfo = () => {
  return {
    async get () {
      const call = await cache.get('SYSTEM_SITEINFO')
      if (call) return call
      const siteInfo = await Options.findOne({ name: 'siteInfo' })
      if (!siteInfo) return {}
      await cache.set('SYSTEM_SITEINFO', siteInfo.value, 1000 * 60 * 60 * 24 * 30)
      return siteInfo.value
    },

    async set (value) {
      await Options.findOneAndUpdate({ name: 'siteInfo' }, { value }, { runValidators: true })
      await cache.del('SYSTEM_SITEINFO')
      return null
    },
  }
}
