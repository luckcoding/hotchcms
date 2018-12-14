const BASE_URL = 'http://localhost:3030'
const API_URL = `${BASE_URL}/backstage-api`

module.exports = {
  siteName: 'Hotchcms',
  copyright: 'Hotchcms © 2018 luckcoding@gmail.com',
  logoPath: '/logo.svg',
  BASE_URL,
  API_URL,
  fixedHeader: true, // sticky primary layout header
  secret: 'hotchcms', // api password secret
  prefix: 'hotchcms', // storage key

  get mediaApiUrl() {
    return `${API_URL}/media`
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
