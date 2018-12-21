import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import { t } from './helpers'

/**
 * default:
 * <I18nProvider local="zh" />
 *   <App />
 * </I18nProvider>
 *
 * if you need local information, need bind instance:
 * <I18nProvider ref={c => I18nProvider.instance = c } >
 * then, you can use `I18nProvider.asyncInfo()` to get some you need
 */
class I18nProvider extends React.Component {
  static instance

  static displayName = 'I18nProvider'

  state = {
    locale: '',
    translations: {},
  }

  static childContextTypes = {
    locale: PropTypes.string,
    translations: PropTypes.object,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      !isEqual(nextProps.locale, prevState.locale) ||
      !isEqual(nextProps.translations, prevState.translations)
    ) {
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
  locale: PropTypes.string.isRequired,
  translations: PropTypes.object.isRequired,
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
 *
 */
class I18n extends React.PureComponent {
  constructor(props, context) {
    super(props, context)
  }

  static contextTypes = {
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
  }

  render() {
    const { locale, translations } = this.context

    return t(this.props, locale, translations)
  }
}

export { I18nProvider }
export default I18n
