import React from 'react'
import App, {Container} from 'next/app'
import NProgress from 'nprogress'
import Router from 'next/router'
import { onlyResult } from 'helpers/request'
import qs from 'qs';

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

      return {
        pageProps: {
          ...pageInitialProps,
          search,
        }
      }
    
    } catch (e) {
      console.error(e.message)
    }
  }

  render () {
    const {Component, pageProps} = this.props
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp
