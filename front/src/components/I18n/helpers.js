import { isObject, isEmpty } from 'lodash'

/**
 * Get the final translation result
 * @param  {Object} params       {zh:"zhXX {name}",en:"enXX {name}",...}
 * @param  {String} locale       "zh"
 * @param  {Object} translations {zh:{id:"zhXX"},en:{id:"enXX"}}
 * @return {String}              "result"
 */
function t(params, locale, translations) {
  params = isObject(params) ? params : {}
  locale = typeof locale === 'string' ? locale : ''
  translations = isObject(translations) ? translations : {}

  const { id, value, ...other } = params

  // lang text, like: "name is: {name}"
  let text = (
    typeof id === 'string'
      ? translations[locale][id]
      : other[locale]
  ) || ''

  // bind {value}
  if (isObject(value) && !isEmpty(value)) {
    for (const key in value) {
      const regx = new RegExp(`{${key}}`, 'g')
      text = text.replace(regx, value[key])
    }
  }

  return text
}

class I18n {
  constructor(translations, locale) {
    if (!isObject(translations) || typeof locale !== 'string') {
      throw TypeError('arguments error')
    }
    this.translations = translations
    this.locale = locale
  }

  t(options, locale, translations) {
    return t(options, locale || this.locale, translations || this.translations)
  }
}
export { t }
export default I18n
