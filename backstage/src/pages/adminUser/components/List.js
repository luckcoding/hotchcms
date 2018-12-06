import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import { config } from 'utils'
import styles from './List.less'

const { getImgUrl } = config
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
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 64,
      className: styles.avatar,
      render: text => text && <img alt="avatar" width={24} src={getImgUrl(text)} />,
    }, {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => <Link to={`adminUser/${record._id}`}>{text}</Link>,
    }, {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    }, {
      title: '管理组',
      dataIndex: 'group',
      key: 'group',
      render: text => <span>{text && text.name}</span>,
    }, {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
    }, {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
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
