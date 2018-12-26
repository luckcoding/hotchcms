import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)

    const sheet = new ServerStyleSheet()
    const page = ctx.renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()

    return {
      ...page,
      ...initialProps,
      styleTags,
    }
  }

  render() {
    return (
      <html lang="en">
        <Head>
          {/* reset */}
          <link rel="stylesheet" type="text/css" href="/static/normalize.css" />

          {/* global */}
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/global-styles.css"
          />

          {/* Import CSS for nprogress */}
          <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />

          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
