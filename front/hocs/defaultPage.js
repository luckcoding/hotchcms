import React from 'react'
import Head from 'next/head'
import { getComponentDisplayName } from 'helpers'
import config from 'helpers/config'
import {connect} from 'react-redux'

import {loadData, startClock, tickClock} from '../store/actions'

const { seo } = config

export default (Page) => {
  class defaultPage extends React.Component {
    static displayName = `Connect(${getComponentDisplayName})`

    static async getInitialProps (ctx) {
      let pageProps, settings

      if (Page.getInitialProps) {
        pageProps = await Page.getInitialProps(ctx)
      }

      if (Page.getSettings) {
        settings = await Page.getSettings(pageProps)
      }

      /**
       * redux startup
       */
      const { store, isServer } = ctx

      store.dispatch(tickClock(isServer))

      if (!store.getState().placeholderData) {
        store.dispatch(loadData())
      }

      return { ...pageProps, settings: { ...settings } }
    }

    render () {
      const { settings, ...pageProps } = this.props
      const { title, keywords, description, append } = settings

      return [
        <Head key="head">
          <title>{title} - {seo.title}</title>
          <meta name="keywords" content={keywords || seo.keywords} />
          <meta name="description" content={description || seo.description} />
          {typeof append ==='function' ? append() : null}
        </Head>,
        <Page key="page" {...pageProps} />
      ]
    }
  }

  return defaultPage
}