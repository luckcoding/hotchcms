import React, { Component } from 'react'
import Header from 'components/Header'
import defaultPage from 'hocs/defaultPage'
import I18n from 'helpers/I18n'

class About extends Component {
  render() {
    return (
      <div>
        <Header />
        <p className="text-center">
          <I18n zh="关于 Hotchcms!" en="This is about Hotchcms!" />
        </p>
      </div>
    )
  }
}

export default defaultPage(About)
