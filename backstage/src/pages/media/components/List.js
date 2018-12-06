import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import classnames from 'classnames'
import styles from './List.less'

const List = ({
  location, ...tableProps
}) => {

  const columns = [
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    }, {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
  ]

  const CommonBody = (props) => {
    return <tbody {...props} />
  }

  return (
    <Table
      {...tableProps}
      className={classnames(styles.table)}
      bordered
      columns={columns}
      simple
      rowKey={record => record._id}
      components={{
        body: { wrapper: CommonBody },
      }}
    />
  )
}

List.propTypes = {
  location: PropTypes.object,
}

export default List
