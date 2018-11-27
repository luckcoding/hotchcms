import React, { Component } from 'react'
import request from 'helpers/request'
import Header from 'components/Header'

export default class About extends Component {
  static async getInitialProps () {
    const categories = await request('categories')
    return {
      categories
    }
  }

  render () {
    const { categories } = this.props
    return (
      <div>
        <Header />
        <div>
          <p>categories:</p>
          <ul>
            {categories.map((i, k) => (
              <li key={k}><a target="_blank" href={`/category/${i.path}`}>{i.name}</a></li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
