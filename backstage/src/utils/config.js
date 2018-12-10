const BASE_URL = 'http://localhost:3030'
const API_URL = `${BASE_URL}/api`

module.exports = {
  siteName: 'Hotchcms',
  copyright: 'Hotchcms © 2018 luckcoding@gmail.com',
  logoPath: '/logo.svg',
  apiPrefix: API_URL,
  fixedHeader: true, // sticky primary layout header
  secret: 'hotchcms', // api password secret
  prefix: 'hotchcms', // storage key

  get inAuth() {
    return `${this.prefix}InAuth`
  },
  get jwt() {
    return `${this.prefix}JWT`
  },

  // full img path
  getImgUrl(path) {
    return `${BASE_URL}/upload/${path}`
  },

  get mediaApiUrl() {
    return `${this.apiPrefix}/media`
  },

  constant: {
    CANCEL_REQUEST_MESSAGE: 'cancle request',
    ROLE_TYPE: {
      ADMIN: 'admin',
      DEFAULT: 'admin',
      DEVELOPER: 'developer',
    },
  },

  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exlude: [/(\/(en|zh))*\/login/],
    },
  ],

  /* I18n configuration, `languages` and `defaultLanguage` are required currently. */
  i18n: {
    /* Countrys flags: https://www.flaticon.com/packs/countrys-flags */
    languages: [
      {
        key: 'en',
        title: 'English',
        flag: '/america.svg',
      },
      {
        key: 'zh',
        title: '中文',
        flag: '/china.svg',
      },
    ],
    defaultLanguage: 'en',
  },
}
