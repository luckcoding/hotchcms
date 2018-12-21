import React from 'react'
import Link from 'next/link'
import defaultPage from 'hocs/defaultPage'
import Header from 'components/Header'
import TextField from 'components/TextField'
import request from 'helpers/request'

class Register extends React.Component {
  static async getSettings() {
    return {
      title: '注册',
    }
  }

  render() {
    const { list } = this.props
    return (
      <div>
        <Header />
      </div>
    )
  }
}

export default defaultPage(Register)
