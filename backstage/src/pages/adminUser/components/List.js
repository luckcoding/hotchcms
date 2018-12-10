import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'
import config from 'config'
import styles from './List.less'

const { getImgUrl } = config
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
        title: <Trans>Avatar</Trans>,
        dataIndex: 'avatar',
        key: 'avatar',
        width: 72,
        fixed: 'left',
        render: text => (
          <Avatar style={{ marginLeft: 8 }} src={getImgUrl(text)} />
        ),
      },
      {
        title: <Trans>Nickname</Trans>,
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: <Trans>邮箱</Trans>,
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: <Trans>手机号</Trans>,
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: <Trans>管理组</Trans>,
        dataIndex: 'group',
        key: 'group',
        render: text => <span>{text && text.name}</span>,
      },
      {
        title: <Trans>创建时间</Trans>,
        dataIndex: 'createDate',
        key: 'createDate',
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
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
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
