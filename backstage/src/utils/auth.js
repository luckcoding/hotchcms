import config from './config'

export default {
  set (jwt) {
    localStorage.setItem(config.jwt, jwt)
  },
  get () {
    return `Bearer ${localStorage.getItem(config.jwt)}`
  },
  login () {
    localStorage.setItem(config.inAuth, 'true')
  },
  logout () {
    localStorage.removeItem(config.jwt)
    localStorage.removeItem(config.inAuth)
  },
  loggedIn () {
    return !!localStorage.getItem(config.inAuth)
  },
  jump () {
    let from = window.location.pathname
    window.location = `${window.location.origin}/login?from=${from}`
  },
}