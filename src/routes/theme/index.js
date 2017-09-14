import React from 'react'
import { Row, Col } from 'antd'
import Item from './Item'

const Theme = () => (
  <Row type="flex" justify="center" align="middle" gutter={20}>
    <Col md={6} sm={12} xs={24}>
      <Item />
    </Col>
    <Col md={6} sm={12} xs={24}>
      <Item />
    </Col>
    <Col md={6} sm={12} xs={24}>
      <Item />
    </Col>
    <Col md={6} sm={12} xs={24}>
      <Item />
    </Col>
  </Row>
)

export default Theme
