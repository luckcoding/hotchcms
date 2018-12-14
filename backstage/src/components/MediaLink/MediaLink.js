import React from 'react'
import PropTypes from 'prop-types'
import { getMediaUrl } from 'utils/helpers'

const MediaLink = ({ children }) => {
  return React.Children.map(children, child => {
    let linkAttrs = {},
      childProps = child.props || {}

    if (childProps.href) {
      linkAttrs.href = getMediaUrl(childProps.href)
    } else if (childProps.src) {
      linkAttrs.src = getMediaUrl(childProps.src)
    }

    if (child.type === 'a') linkAttrs.target = '_blank'

    return React.cloneElement(child, linkAttrs)
  })
}

MediaLink.propTypes = {
  children: PropTypes.node,
}

export default MediaLink
