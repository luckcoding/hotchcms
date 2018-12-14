import React from 'react'
import Link from 'next/link'
import defaultPage from 'hocs/defaultPage'
import Header from 'components/Header'
import ListTitle from 'components/ListTitle'
import ListItem from 'components/ListItem'
import request from 'helpers/request'
import { get } from 'lodash'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 20px;
`

const Title = styled.h1`
  color: #262626;
  font-family: PingFangSC-Medium;
  font-size: 30px;
  letter-spacing: 0;
  line-height: 42px;
  text-align: justify;
`

const Summary = styled.p`
  color: #787878;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  letter-spacing: 0;
  line-height: 24px;

  &:after {
    border: .5px solid #e5e5e5;
    content: "";
    display: block;
    margin: 20px 0;
    width: 58px;
  }
`

class Index extends React.Component {
  static async getInitialProps ({ query }) {
    const result = await request('article/:_id', query)

    return {
      content: result || {}
    }
  }

  static async getSettings ({ content }) {
    return {
      title: content.title,
    }
  }

  render () {
    const { content: _ } = this.props
    return (
      <div>
        <Header />
        <Wrapper>
          <Title>{_.title}</Title>
          <div><a>{_.author}</a><span>{_.createDate}</span></div>
          <Summary>{_.subTitle}</Summary>

          <div
            dangerouslySetInnerHTML={{
              __html: _.content,
            }}
          />
          </Wrapper>
      </div>
    )
  }
}

export default defaultPage(Index)
