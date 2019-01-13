import Router from 'next/router'
import { Href } from 'components/Link/helpers'
import { defaultLocale } from './I18n'

export default {
  push: (path) => {
    const factory = new Href(defaultLocale.value, window.location.pathname)
    Router.push(factory.prefix(path))
  },
  replace: (path) => {
    const factory = new Href(defaultLocale.value, window.location.pathname)
    Router.replace(factory.prefix(path))
  },
}
