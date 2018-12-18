import React from 'react'
import App, {Container} from 'next/app'
import NProgress from 'nprogress'
import Router from 'next/router'
import defaultPage from 'hocs/defaultPage'
import qs from 'qs'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'
import { I18nProvider } from 'helpers/I18n'

import configureStore from '../store/configureStore'

Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

class MyApp extends App {
  static async getInitialProps ({ Component, ctx, router }) {
    try {
      // search params
      let search = qs.parse(ctx.asPath.split('?')[1] || '')
      
      let pageInitialProps = {}

      if (Component.getInitialProps) {
        pageInitialProps = await Component.getInitialProps({ ...ctx, search })
      }

      // Get the `locale` from the request object on the server.
      // In the browser, use the same values that the server serialized.
      const { req } = ctx
      const { locale } = req || window.__NEXT_DATA__.props
      console.log('locale',locale)
      return {
        pageProps: {
          ...pageInitialProps,
          search,
        },
        locale,
      }
    
    } catch (e) {
      console.error(e.message)
    }
  }

  render () {
    const {Component, pageProps, store, locale} = this.props
    return (
      <Container>
        <Provider store={store}>
          <I18nProvider locale={locale}>
            <Component {...pageProps} />
          </I18nProvider>
        </Provider>
      </Container>
    )
  }
}

export default withRedux(configureStore)(withReduxSaga({ async: true })(MyApp))
