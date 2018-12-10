import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

@withI18n()
@connect(({ category, loading }) => ({ category, loading }))
class Category extends PureComponent {
  render() {
    const { location, dispatch, category, loading, i18n } = this.props
    const { query, pathname } = location
    const {
      list,
      currentItem,
      modalVisible,
      modalType,
      selectedRowKeys,
    } = category

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
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects[`category/${modalType}`],
      title: `${
        modalType === 'create'
          ? i18n.t`Create category`
          : i18n.t`Update category`
      }`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
        dispatch({
          type: `category/${modalType}`,
          payload: data,
        }).then(() => {
          handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'category/hideModal',
        })
      },
    }

    const listProps = {
      dataSource: list,
      loading: loading.effects['category/query'],
      pagination: false,
      onDeleteItem(_id) {
        dispatch({
          type: 'category/delete',
          payload: _id,
        }).then(() => {
          handleRefresh()
        })
      },
      onEditItem(item) {
        dispatch({
          type: 'category/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
      rowSelection: {
        selectedRowKeys,
        onChange: keys => {
          dispatch({
            type: 'category/updateState',
            payload: {
              selectedRowKeys: keys,
            },
          })
        },
      },
    }

    const filterProps = {
      filter: {
        ...query,
      },
      onFilterChange(value) {
        handleRefresh({
          ...value,
        })
      },
      onAdd() {
        dispatch({
          type: 'category/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }

    const handleDeleteItems = () => {
      dispatch({
        type: 'category/multiDelete',
        payload: {
          multi: selectedRowKeys,
          type: 'remove',
        },
      }).then(() => {
        handleRefresh()
      })
    }

    return (
      <Page inner>
        <Filter {...filterProps} />
        {selectedRowKeys.length > 0 && (
          <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
            <Col>
              {`Selected ${selectedRowKeys.length} items `}
              <Popconfirm
                title="Are you sure delete these items?"
                placement="left"
                onConfirm={handleDeleteItems}
              >
                <Button type="primary" style={{ marginLeft: 8 }}>
                  Remove
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        )}
        <List {...listProps} />
        {modalVisible && <Modal {...modalProps} />}
      </Page>
    )
  }
}

Category.propTypes = {
  category: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Category
