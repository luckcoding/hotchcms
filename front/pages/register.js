import React from 'react'
import defaultPage from 'hocs/defaultPage'
import Header from 'components/Header'

class Register extends React.Component {
  static async getSettings() {
    return {
      title: '注册',
    }
  }

  render() {
    return (
      <div>
        <Header />
      </div>
    )
  }
}

export default defaultPage(Register)
