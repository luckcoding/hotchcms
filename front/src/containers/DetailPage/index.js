import React from 'react'
import PropTypes from 'prop-types'
import defaultPage from 'hocs/defaultPage'
import Header from 'components/Header'
import { Container } from 'react-bootstrap'
import request from 'helpers/request'
import styled from 'styled-components'

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
    border: 0.5px solid #e5e5e5;
    content: '';
    display: block;
    margin: 20px 0;
    width: 58px;
  }
`

class Detail extends React.Component {
  static async getInitialProps({ query }) {
    const content = await request('articleDetail', query).then(res => res.toJson())
    return {
      content,
    }
  }

  static async getSettings({ content }) {
    return {
      title: content.title,
    }
  }

  render() {
    const { content: _ } = this.props
    return (
      <div>
        <Header />
        <Container>
          <Title>{_.title}</Title>
          <div>
            <a>{_.author}</a>
            <span>{_.createDate}</span>
          </div>
          <Summary>{_.subTitle}</Summary>

          <div
            dangerouslySetInnerHTML={{
              __html: _.content,
            }}
          />
        </Container>
      </div>
    )
  }
}

Detail.propTypes = {
  content: PropTypes.object.isRequired,
}

export default defaultPage(Detail)
