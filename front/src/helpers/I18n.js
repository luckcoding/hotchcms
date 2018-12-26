import React from 'react'
import I18n, { I18nProvider as Provider } from 'components/I18n'
import { t } from 'components/I18n/helpers'

export const defaultLocale = {
  locale: '',
  get value() {
    return this.locale
  },
  set value(value) {
    this.locale = value
  },
}

export const defaultTranslations = {
  zh: {
    'latest articles': '最新文章',
  },
  en: {
    'latest articles': 'latest articles',
  },
}

export function I18nProvider({ children, ...props }) {
  defaultLocale.value = props.locale
  return (
    <Provider translations={defaultTranslations} {...props}>
      {children}
    </Provider>
  )
}

/**
 * trans the variable message
 * @param {Object} params       {zh:'',en:'',...} or {id:''}
 * @param {String} locale       'zh'
 * @param {Object} translations can be null
 */
export function Trans(params, locale, translations) {
  return t(
    params,
    locale || defaultLocale.value,
    translations || defaultTranslations
  )
}

export default I18n
