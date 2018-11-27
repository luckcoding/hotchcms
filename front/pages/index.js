import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Header from 'components/Header'

export default class Index extends React.Component {
  render () {
    const { siteInfo } = this.props
    return (
      <div>
        <Head>
          <title>{siteInfo.title}</title>
          <meta name="keywords" content={siteInfo.keywords.join(',')} />
          <meta name="description" content={siteInfo.description} />
        </Head>
        <Header />
        <h1 className="text-center">{siteInfo.title}</h1>
      </div>
    )
  }
}
