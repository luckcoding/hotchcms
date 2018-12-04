import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import styles from './List.less'

const { confirm } = Modal

const List = ({
  onDeleteItem, onEditItem, location, ...tableProps
}) => {

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '你确定删除这条记录吗?',
        onOk () {
          onDeleteItem(record._id)
        },
      })
    }
  }

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    }, {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '目录',
      dataIndex: 'path',
      key: 'path',
    }, {
      title: '是否显示',
      dataIndex: 'state',
      key: 'state',
      render: text => text ? '是' : '否',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => (
        <DropOption
          onMenuClick={e => handleMenuClick(record, e)}
          menuOptions={[{ key: '1', name: '更新' }, { key: '2', name: '删除' }]}
        />
      ),
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
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
