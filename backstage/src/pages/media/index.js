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
@connect(({ media, loading }) => ({ media, loading }))
class Media extends PureComponent {
  render() {
    const { location, dispatch, media, loading, i18n } = this.props
    const { query, pathname } = location
    const {
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
      selectedRowKeys,
    } = media

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
      confirmLoading: loading.effects[`media/${modalType}`],
      title: `${
        modalType === 'create' ? i18n.t`Create media` : i18n.t`Update media`
      }`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
        dispatch({
          type: `media/${modalType}`,
          payload: data,
        }).then(() => {
          handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'media/hideModal',
        })
      },
    }

    const listProps = {
      dataSource: list,
      loading: loading.effects['media/query'],
      pagination,
      onChange(page) {
        handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
      onDeleteItem(_id) {
        dispatch({
          type: 'media/delete',
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
          type: 'media/showModal',
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
            type: 'media/updateState',
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
          page: 1,
        })
      },
      onAdd() {
        dispatch({
          type: 'media/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }

    const handleDeleteItems = () => {
      dispatch({
        type: 'media/multiDelete',
        payload: {
          multi: selectedRowKeys,
          type: 'remove',
        },
      }).then(() => {
        handleRefresh({
          page:
            list.length === selectedRowKeys.length && pagination.current > 1
              ? pagination.current - 1
              : pagination.current,
        })
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

Media.propTypes = {
  media: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Media
