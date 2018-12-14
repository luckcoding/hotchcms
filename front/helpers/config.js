const BASE_URL = 'http://localhost:3030'
const API_URL = `${BASE_URL}/backstage-api`

export default {
  BASE_URL,
  API_URL,
  secret: 'hotchcms', // api password secret
  prefix: 'hotchcms', // storage key

  seo: {
    title: 'Hotchcms',
    keywords: 'hotchcms,react,next.js',
    description: 'A lightweight cms system .',
  }
}