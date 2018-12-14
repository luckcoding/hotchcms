import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { Link } from 'dva/router'
import { withI18n, Trans } from '@lingui/react'
import { DropOption } from 'components'
import { getMediaUrl } from 'utils/helpers'
import styles from './List.less'

const { confirm } = Modal

@withI18n()
class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n } = this.props

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: i18n.t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record._id)
        },
      })
    }
  }

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props
    const columns = [
      {
        title: i18n.t`Title`,
        dataIndex: 'title',
        fixed: 'left',
        render: (text, record) => (
          <Link to={`article/${record._id}`}>{text || record._id}</Link>
        ),
      },
      {
        title: i18n.t`Cover`,
        dataIndex: 'cover',
        render: text => (
          <img alt="cover" style={{ width: '100px' }} src={getMediaUrl(text)} />
        ),
      },
      {
        title: i18n.t`Author`,
        dataIndex: 'author',
      },
      {
        title: i18n.t`Category`,
        dataIndex: 'category.name',
      },
      {
        title: i18n.t`Tags`,
        dataIndex: 'tags',
        render: text => (
          <span>{Array.isArray(text) ? text.join('/') : ''}</span>
        ),
      },
      {
        title: i18n.t`Comments`,
        dataIndex: 'comments',
      },
      {
        title: i18n.t`Views`,
        dataIndex: 'viewNum',
      },
      {
        title: i18n.t`CreateTime`,
        dataIndex: 'createDate',
      },
      {
        title: i18n.t`UpdateTime`,
        dataIndex: 'updateDate',
      },
      {
        title: <Trans>Operation</Trans>,
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: i18n.t`Update` },
                { key: '2', name: i18n.t`Delete` },
              ]}
            />
          )
        },
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

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
