import React from 'react'
import Head from 'next/head'
import { getComponentDisplayName } from 'helpers'
import config from 'helpers/config'

const { seo } = config

export default (Page) => {
  class defaultPage extends React.Component {
    static displayName = `Connect(${getComponentDisplayName})`

    static async getInitialProps (ctx) {

      let pageProps, headSetting


      if (Page.getInitialProps) {
        pageProps = await Page.getInitialProps(ctx)
      }

      if (Page.getHeadSetting) {
        headSetting = await Page.getHeadSetting(pageProps)
      }

      return {
        ...pageProps,
        headSetting: { ...headSetting },
      }
    }

    render () {
      const { headSetting: setting, ...pageProps } = this.props
      return [
        <Head key="head">
          <title>{setting.title} - {seo.title}</title>
          <meta name="keywords" content={setting.keywords || seo.keywords} />
          <meta name="description" content={setting.description || seo.description} />
          {typeof setting.append ==='function' ? setting.append() : null}
        </Head>,
        <Page key="page" {...pageProps} />
      ]
    }
  }

  return defaultPage
}