import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

const AdminGroup = ({
  location, dispatch, adminGroup, loading,
}) => {
  const { query, pathname } = location
  const {
    list, pagination, currentItem, authority, modalVisible, modalType,
  } = adminGroup

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify({
        ...query,
        ...newQuery,
      }),
    }))
  }

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    authority,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`adminGroup/${modalType}`],
    title: `${modalType === 'create' ? ' 创建' : '更新'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `adminGroup/${modalType}`,
        payload: data,
      })
        .then(() => {
          handleRefresh()
        })
    },
    onCancel () {
      dispatch({
        type: 'adminGroup/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['adminGroup/query'],
    pagination,
    location,
    onChange (page) {
      handleRefresh({
        page: page.current,
        pageSize: page.pageSize,
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'adminGroup/delete',
        payload: id,
      })
        .then(() => {
          handleRefresh({
            page: (list.length === 1 && pagination.current > 1) ? pagination.current - 1 : pagination.current,
          })
        })
    },
    onEditItem (item) {
      dispatch({
        type: 'adminGroup/queryAuthority',
      })
        .then(() => {
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
    onFilterChange (value) {
      handleRefresh({
        ...value,
        page: 1,
      })
    },
    onAdd () {
      dispatch({
        type: 'adminGroup/queryAuthority',
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

AdminGroup.propTypes = {
  adminGroup: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ adminGroup, loading }) => ({ adminGroup, loading }))(AdminGroup)
