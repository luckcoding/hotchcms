const BASE_URL = 'http://localhost:3030'
const API_URL = `${BASE_URL}/api/`

export default {
  BASE_URL,
  API_URL,
  getApiUrl(url) {
    return /[a-zA-z]+:\/\/[^/]*/.test(url) ? url : `${BASE_URL}/${url}`
  },
  secret: 'hotchcms', // api password secret
  prefix: 'hotchcms', // storage key

  seo: {
    title: 'Hotchcms',
    keywords: 'hotchcms,react,next.js',
    description: 'A lightweight cms system .',
  },
}
