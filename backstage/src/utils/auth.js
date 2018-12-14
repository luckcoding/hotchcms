import config from './config'

const JWT_NAME = `${config.prefix}JWT`
const INAUTH_NAME = `${config.prefix}InAuth`

export default {
  set(jwt) {
    localStorage.setItem(JWT_NAME, jwt)
  },
  get() {
    return `Bearer ${localStorage.getItem(JWT_NAME)}`
  },
  login() {
    localStorage.setItem(INAUTH_NAME, 'true')
  },
  logout() {
    localStorage.removeItem(JWT_NAME)
    localStorage.removeItem(INAUTH_NAME)
  },
  loggedIn() {
    return !!localStorage.getItem(INAUTH_NAME)
  },
  jump() {
    let from = window.location.pathname
    window.location = `${window.location.origin}/login?from=${from}`
  },
}
