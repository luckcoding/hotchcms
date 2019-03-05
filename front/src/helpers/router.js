import qs from 'qs'
import Router from 'next/router'
import { Href } from 'components/Link/helpers'
import { defaultLocale } from './I18n'

/**
 *  分解路径URL
 * @param  {String} path
 * @return {Object}
 */
function decompose(path = '') {
  const parts = path.split('?')
  return {
    pathname: parts[0],
    search: qs.parse(parts[1] || ''),
  }
}

/**
 * 解析最终路由
 * @param  {String}  path 路径
 * @param  {Boolean} tail 是否带上 from
 * @return {String}
 */
function handle(path, tail = false) {
  const currentPathname = window.location.pathname
  const { pathname, search } = decompose(path)
  const factory = new Href(defaultLocale.value, currentPathname)

  const params = search
  if (tail) {
    params.__from__ = currentPathname
  }

  return `${factory.prefix(pathname)}?${qs.stringify(params)}`
}

export default {
  push(path, tail) {
    Router.push(handle(path, tail))
  },
  replace(path) {
    Router.replace(handle(path))
  },
  back(outsite = false) {
    if (outsite) {
      window.history.back()
    } else {
      const { search } = decompose(window.location.href)
      const pathname = search.__from__ || '/'
      Router.replace(pathname)
    }
  },
}
