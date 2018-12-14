import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

@withI18n()
@connect(({ adminUser, loading }) => ({ adminUser, loading }))
class AdminUser extends PureComponent {
  render() {
    const { location, dispatch, adminUser, loading, i18n } = this.props
    const { query, pathname } = location
    const {
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
      allAdminGroupList,
    } = adminUser

    const handleRefresh = newQuery => {
      router.push({
        pathname,
        search: stringify(
          {
            ...query,
            ...newQuery,
          },
          { arrayFormat: 'repeat' }
        ),
      })
    }

    const modalProps = {
      item: modalType === 'create' ? {} : currentItem,
      modalType,
      allAdminGroupList,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects[`adminUser/${modalType}`],
      title: `${
        modalType === 'create'
          ? i18n.t`Create Admin User`
          : i18n.t`Update Admin User`
      }`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
        dispatch({
          type: `adminUser/${modalType}`,
          payload: data,
        }).then(() => {
          handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'adminUser/hideModal',
        })
      },
    }

    const listProps = {
      dataSource: list,
      loading: loading.effects['adminUser/query'],
      pagination,
      onChange(page) {
        handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
      onDeleteItem(_id) {
        dispatch({
          type: 'adminUser/delete',
          payload: _id,
        }).then(() => {
          handleRefresh({
            page:
              list.length === 1 && pagination.current > 1
                ? pagination.current - 1
                : pagination.current,
          })
        })
      },
      onEditItem(item) {
        dispatch({
          type: 'adminUser/queryAllAdminGroupList',
        }).then(() => {
          dispatch({
            type: 'adminUser/showModal',
            payload: {
              modalType: 'update',
              currentItem: item,
            },
          })
        })
      },
    }

    const filterProps = {
      filter: {
        ...query,
      },
      onFilterChange(value) {
        handleRefresh({
          ...value,
          page: 1,
        })
      },
      onAdd() {
        dispatch({
          type: 'adminUser/queryAllAdminGroupList',
        }).then(() => {
          dispatch({
            type: 'adminUser/showModal',
            payload: {
              modalType: 'create',
            },
          })
        })
      },
    }

    return (
      <Page inner>
        <Filter {...filterProps} />
        <List {...listProps} />
        {modalVisible && <Modal {...modalProps} />}
      </Page>
    )
  }
}

AdminUser.propTypes = {
  adminUser: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default AdminUser
