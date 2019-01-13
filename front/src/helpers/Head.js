import React from 'react'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import NextHead from 'next/head'

const SEO_DATA = require('./seo.json')

export { SEO_DATA }

/**
 * 替换动态值
 * @param  {String} str    template
 * @param  {Object} values values
 * @return {String}        template after repalce
 */
export function valuesReplace(str, values) {
  let output = str || ''
  Object.keys(values).forEach((key) => {
    const regx = new RegExp(`{${key}}`, 'g')
    output = output.replace(regx, values[key])
  })
  return output
}

class Head extends React.PureComponent {
  static contextTypes = {
    locale: PropTypes.string.isRequired,
  }

  render() {
    const { name, children, values } = this.props
    const { locale } = this.context

    const SEODATA = get(SEO_DATA, `${name}.${locale}`) || {}

    const { title, keywords, description } = SEODATA
    return (
      <NextHead>
        <title>{valuesReplace(title, values)}</title>
        <meta name="keywords" content={valuesReplace(keywords, values)} />
        <meta name="description" content={valuesReplace(description, values)} />
        {children}
      </NextHead>
    )
  }
}

Head.defaultProps = {
  values: {},
}

Head.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  values: PropTypes.object,
}

export default Head
