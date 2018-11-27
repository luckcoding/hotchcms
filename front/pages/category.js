import React, { Component } from 'react'
import request from 'helpers/request'
import Header from 'components/Header'

export default class About extends Component {
  static async getInitialProps () {
    const contents = await request('contents')
    return {
      contents
    }
  }

  render () {
    const { contents } = this.props
    return (
      <div>
        <Header />
        <div>
          <p>contents:</p>
          {contents.list.map((i, k) => (
            <article key={k}>
              <h3><a target="_blank" href={`/content/${i.path}`}>{i.title}</a></h3>
              <p>{i.subtitle}</p>
            </article>
          ))}
        </div>
      </div>
    )
  }
}
