import config from './config'

export function getMediaUrl(path) {
  if (typeof path === 'string') {
    return path.indexOf('http') === 0
      ? path
      : `${config.BASE_URL}/upload/${path}`
  } else {
    return null
  }
}

export function handleFileListUrl(fileList) {
  return fileList.map(fileItem => ({
    ...fileItem,
    url: getMediaUrl(fileItem.url),
  }))
}
