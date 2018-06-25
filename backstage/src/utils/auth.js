import config from './config'

export default {
  set (token) {
    localStorage.setItem(`${config.prefix}token`, token)
  },
  get () {
    return `Bearer ${localStorage.getItem(`${config.prefix}token`)}`
  },
  jump () {
    let from = window.location.pathname
    window.location = `${window.location.origin}/login?from=${from}`
  },
}