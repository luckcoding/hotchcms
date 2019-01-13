import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import defaultPage from 'hocs/defaultPage'
import Header from 'components/Header'
import ListTitle from 'components/ListTitle'
import ListItem from 'components/ListItem'
import Pagination from 'components/Pagination'
import request from 'helpers/request'
import I18n from 'helpers/I18n'
import { get } from 'lodash'
import { Container, Row, Col } from 'react-bootstrap'

import { connect } from 'react-redux'
import { startClock } from 'store/actions'

class Index extends React.Component {
  static async getInitialProps({ search }) {
    const {
      list, total, pageSize, page,
    } = await request('article', search).then(res => res.toPage())

    return {
      list,
      pageInfo: {
        total,
        pageSize,
        page,
      },
    }
  }

  static async getSettings() {
    return {
      title: '首页',
    }
  }

  componentDidMount() {
    this.props.dispatch(startClock())
  }

  render() {
    const { list, search, pageInfo } = this.props

    return (
      <Fragment>
        <Header />
        <Container>
          <Row>
            <Col md={12} lg={9}>
              <ListTitle>
                <I18n id="latest articles" />
              </ListTitle>
              {list.map((_, key) => (
                <ListItem
                  url={`/p/${_._id}`}
                  key={key}
                  title={_.title}
                  description={_.subTitle}
                  date={_.createDate}
                  tag={get(_.category, 'name')}
                  category={get(_.category, 'name')}
                  cover={_.cover}
                  author={_.originalAuthor || get(_.author, 'nickname')}
                />
              ))}
              <Pagination search={search} {...pageInfo} />
            </Col>
            <Col md={12} lg={3}>
              <ListTitle>
                <I18n id="popular articles" />
              </ListTitle>
            </Col>
          </Row>
        </Container>
      </Fragment>
    )
  }
}

Index.propTypes = {
  dispatch: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
}

export default connect()(defaultPage(Index))
