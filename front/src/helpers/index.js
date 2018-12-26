import config from './config'

export function getComponentDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export function getMediaUrl(path) {
  if (typeof path === 'string') {
    return path.indexOf('http') === 0
      ? path
      : `${config.BASE_URL}/upload/${path}`
  }
  return null
}

export { config }
