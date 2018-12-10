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
@connect(({ adminGroup, loading }) => ({ adminGroup, loading }))
class AdminGroup extends PureComponent {
  render() {
    const { location, dispatch, adminGroup, loading, i18n } = this.props
    const { query, pathname } = location
    const {
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
      authoritiesOwned,
    } = adminGroup

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
      authoritiesOwned,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects[`adminGroup/${modalType}`],
      title: `${
        modalType === 'create' ? i18n.t`Create User` : i18n.t`Update User`
      }`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
        dispatch({
          type: `adminGroup/${modalType}`,
          payload: data,
        }).then(() => {
          handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'adminGroup/hideModal',
        })
      },
    }

    const listProps = {
      dataSource: list,
      loading: loading.effects['adminGroup/query'],
      pagination,
      onChange(page) {
        handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
      onDeleteItem(_id) {
        dispatch({
          type: 'adminGroup/delete',
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
          type: 'adminGroup/queryAuthoritiesOwned',
        }).then(() => {
          dispatch({
            type: 'adminGroup/showModal',
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
          type: 'adminGroup/queryAuthoritiesOwned',
        }).then(() => {
          dispatch({
            type: 'adminGroup/showModal',
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

AdminGroup.propTypes = {
  adminGroup: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default AdminGroup
