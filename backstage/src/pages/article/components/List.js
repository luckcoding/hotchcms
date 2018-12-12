import React, { PureComponent } from 'react'
import { Table, Avatar } from 'antd'
import { Link } from 'dva/router'
import { withI18n } from '@lingui/react'
import styles from './List.less'

@withI18n()
class List extends PureComponent {
  render() {
    const { i18n, ...tableProps } = this.props
    const columns = [
      {
        title: i18n.t`封面`,
        dataIndex: 'cover',
        render: text => <Avatar shape="square" src={text} />,
      },
      {
        title: '标题',
        dataIndex: 'title',
        render: (text, record) => (
          <Link to={`article/${record._id}`}>{text || record._id}</Link>
        ),
      },
      {
        title: '作者',
        dataIndex: 'author',
      },
      {
        title: '分类',
        dataIndex: 'category.name',
      },
      {
        title: '标签',
        dataIndex: 'tags',
        render: text => (
          <span>{Array.isArray(text) ? text.join('/') : ''}</span>
        ),
      },
      {
        title: '评论数',
        dataIndex: 'comments',
      },
      {
        title: '浏览数',
        dataIndex: 'viewNum',
      },
      {
        title: '创建日期',
        dataIndex: 'createDate',
      },
      {
        title: '最后更新日期',
        dataIndex: 'updateDate',
      },
    ]

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        bordered
        scroll={{ x: 1400 }}
        className={styles.table}
        columns={columns}
        simple
        rowKey={record => record._id}
      />
    )
  }
}

export default List
