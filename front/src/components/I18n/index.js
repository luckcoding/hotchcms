import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import { t } from './helpers'

/**
 *
 * <I18nProvider local="zh" />
 *   <App />
 * </I18nProvider>
 */
class I18nProvider extends React.Component {
  static instance

  static displayName = 'I18nProvider'

  constructor(props) {
    super(props)
    this.state = {
      locale: props.locale,
      translations: props.translations,
    }
  }

  static childContextTypes = {
    locale: PropTypes.string,
    translations: PropTypes.object,
    languages: PropTypes.array,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.locale, prevState.locale)
      || !isEqual(nextProps.translations, prevState.translations)) {
      return {
        ...prevState,
        locale: nextProps.locale,
        translations: nextProps.translations,
      }
    }
    return null
  }

  // static asyncInfo () {
  //   let self = this
  //   return {
  //     get locale() {
  //       return get(self, 'instance.props.locale')
  //     },
  //     I18n: (...args) => {

  //     }
  //   }
  // }

  getChildContext() {
    return {
      locale: this.state.locale,
      translations: this.state.translations,
      languages: Object.keys(this.state.translations),
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

I18nProvider.defaultProps = {
  locale: 'zh',
  translations: {},
}

I18nProvider.propTypes = {
  locale: PropTypes.string,
  translations: PropTypes.object,
  children: PropTypes.node,
}

/**
 * lang =>
 *
 * {
 *   "zh": {
 *     "ID": "名字: {name}",
 *   },
 *   "en": {
 *     "ID": "name: {name}",
 *   },
 * }
 *
 * <I18nNode zh="名字" en="name" />
 * <I18nNode value={name: 'xx'} zh="名字: {name}" en="name: {name}" />
 * <I18nNode id="ID" value={name: 'xx'} />
 * <I18nNode id="ID" format={(text, locale) => 'format'} />
 * <I18nNode id="ID" wrapper={text => <div>{text}</div>} />
 */
class I18n extends React.PureComponent {
  static contextTypes = {
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
  }

  render() {
    const { locale, translations } = this.context

    const {
      wrapper, format, value, ...props
    } = this.props

    let text = t(props, locale, translations)

    if (typeof format === 'function') {
      text = format(value, locale)
    } else if (format && typeof format[locale] === 'function') {
      text = format[locale](text, locale)
    }

    text = text || ''

    return wrapper ? wrapper(text) : text
  }
}

I18n.propTypes = {
  value: PropTypes.any,
  wrapper: PropTypes.func,
  format: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
}

export { I18nProvider }
export default I18n
