import React, { Children } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { withRouter } from 'next/router'
import NextLink from 'next/link'
import * as helpers from './helpers'

/**
 * 加上语言钩子
 * <Link href="/en"><a>/?/en</a></Link>
 *
 * 不加语言钩子
 * <Link isPure href="/en"><a>isPure /en</a></Link>
 *
 * 不使用<a>标签
 * <Link isPure href="/zh"><div>isPure div /zh</div></Link>
 *
 * 高亮
 * <Link activeClassName="active" href="/user"><a>user</a></Link>
 */
class Link extends React.PureComponent {
  static contextTypes = {
    locale: PropTypes.string.isRequired,
  }

  render() {
    const {
      router, href = '', isPure, activeClassName, children, ...props
    } = this.props
    const { locale } = this.context

    const factory = new helpers.Href(locale, router.asPath)
    const nextHref = isPure ? factory.pure(href) : factory.prefix(href)

    const child = Children.only(children)
    let className = get(child.props, 'className') || ''

    if (href === router.pathname && activeClassName) {
      className = `${className} ${activeClassName}`.trim()
    }

    return (
      <NextLink href={nextHref} {...props}>
        {React.cloneElement(child, { className })}
      </NextLink>
    )
  }
}

Link.propTypes = {
  href: PropTypes.string, // 要跳转的路径
  children: PropTypes.node,
  isPure: PropTypes.bool, // 纯粹跳转
  activeClassName: PropTypes.string, // 高尚亮样式
}

export * from './helpers'
export default withRouter(Link)
