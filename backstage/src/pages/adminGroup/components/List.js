import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'
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
        title: <Trans>Name</Trans>,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: <Trans>Description</Trans>,
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: <Trans>Gradation</Trans>,
        dataIndex: 'gradation',
        key: 'gradation',
      },
      {
        title: <Trans>Authority</Trans>,
        dataIndex: 'authority',
        key: 'authority',
        render: (text = []) => {
          return (
            <div
              style={{
                fontSize: '12px',
                display: 'inline-block',
                maxWidth: '300px',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                wordBreak: 'break-all',
              }}
            >
              {text.map(_ => _.name).join(',')}
            </div>
          )
        },
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
        scroll={{ x: 800 }}
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
