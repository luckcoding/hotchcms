let NEW_WIN = {}

/**
 * 判断是否是全路径
 * @param  {String}  url 路径
 * @return {Boolean}
 */
export function isUrl(url) {
  return typeof url === 'string' && /(^https?\:\/\/|^(\w+\.)?\w+\.\w+)/.test(url)
}

/**
 * 补全路径，防止外站跳不出去
 */
export function completeUrl(url) {
  let outUrl = String(url)

  if (!outUrl.startsWith('http')) {
    outUrl = `http://${outUrl}`
  }

  return outUrl
}

export const Jump = {
  init() {
    NEW_WIN = window.open()
  },
  open(url) {
    NEW_WIN.location.href = completeUrl(url)
  },
}

/**
 * 多语言路由
 * @param {String} locale 当前语言环境
 * @param {String} asPath 当前全路径
 */

/**
 * 多语言路由
 * @param {String} locale 当前语言环境
 * @param {String} asPath 当前全路径
 */
function Href(locale, asPath = '') {
  this.locale = locale
  this.asPath = asPath
  this.regExp = null
  this.localePrefix = this.getLocalePrefix()

  return this
}

/**
 * 计算是否需要在路由上加多语言路径
 * @return {String}
 */
Href.prototype.getLocalePrefix = function () {
  const { asPath, locale } = this
  this.regExp = new RegExp(`(^\/${locale}$|^\/${locale}\/)`, 'g')
  return this.regExp.test(asPath) ? `/${locale}` : ''
}

/**
 * 路由对应语言环境
 * @param  {String} href  站内路径
 * @param  {String} force 强制当前语言环境
 * @param  {Boolean} clear
 * 是否先删除路径的多语言前标 @@处理当前环境为 zh ，但接受路径为 /zh/xxx 等情况， 默认为 true
 * @return {String}       最终路径
 */
Href.prototype.prefix = function (href, force, clear = true) {
  let pureHref = this.pure(href)

  if (clear) {
    pureHref = pureHref.replace(this.regExp, '/')
  }

  let localePrefix = String(force || this.localePrefix)

  if (!localePrefix.startsWith('/')) {
    localePrefix = `/${localePrefix}`
  }

  return `${this.localePrefix}${pureHref}`
}

/**
 * 不添加语言 localePrefix
 * @param  {String} href 原路径
 * @return {String}      处理后的路径
 */
Href.prototype.pure = function (href) {
  return `/${href}`
    .replace(/\/{2,}/g, '/') // 去除重复 /
    .replace(/.+(\/#)/g, '#') // 修改非根路径后的 /# => #
}

export { Href }
