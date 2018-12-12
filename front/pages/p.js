import React from 'react'
import Link from 'next/link'
import defaultPage from 'hocs/defaultPage'
import Header from 'components/Header'
import ListTitle from 'components/ListTitle'
import ListItem from 'components/ListItem'
import request from 'helpers/request'
import { get } from 'lodash'

class Index extends React.Component {
  static async getInitialProps ({ query }) {
    const result = await request('article/:_id', query)

    return {
      content: result || {}
    }
  }

  static async getHeadSetting ({ content }) {
    return {
      title: content.title,
    }
  }

  render () {
    const { list } = this.props
    return (
      <div>
        <Header />
        
      </div>
    )
  }
}

export default defaultPage(Index)
