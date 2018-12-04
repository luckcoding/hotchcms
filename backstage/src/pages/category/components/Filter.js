/* global document */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col } from 'antd'

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const Filter = ({
  onAdd,
}) => {

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        <Button type="ghost" onClick={onAdd}>创建</Button>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
}

export default Filter
