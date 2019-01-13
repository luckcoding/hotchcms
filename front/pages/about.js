import React from 'react'
import Header from 'components/Header'
import defaultPage from 'hocs/defaultPage'
import I18n from 'helpers/I18n'

function About() {
  return (
    <div>
      <Header />
      <p className="text-center">
        <I18n zh="关于 Hotchcms!" en="This is about Hotchcms!" />
      </p>
    </div>
  )
}

About.getSettings = () => ({
  title: '关于',
})

export default defaultPage(About)
