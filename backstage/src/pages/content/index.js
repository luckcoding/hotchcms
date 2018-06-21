import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Tabs, Icon, Button, Row, Col, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import forEach from 'lodash/forEach'
import List from './components/List'

const TabPane = Tabs.TabPane

const EnumPostStatus = {
  UNPUBLISH: 0,
  PUBLISHED: 1,
  DELETED: 2,
}

const queryActive = function (status) {
  let active = String(EnumPostStatus.PUBLISHED)
  forEach(EnumPostStatus, (value) => {
    if (String(value) === status) {
      active = String(value)
    }
  })
  return active
}

const Content = ({
  location, dispatch, content, loading,
}) => {
  const { query, pathname } = location
  const {
    list, pagination, selectedRowKeys,
  } = content

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify({
        ...query,
        ...newQuery,
      }),
    }))
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['content/query'],
    pagination,
    location,
    onChange (page) {
      handleRefresh({
        page: page.current,
        pageSize: page.pageSize,
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'content/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const handleTabClick = (key) => {
    dispatch(routerRedux.push({
      pathname,
      query: {
        status: key,
      },
    }))
  }

  const onEdit = () => {
    dispatch(routerRedux.push('content/edit'))
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'content/multiDelete',
      payload: {
        multi: selectedRowKeys,
      },
    })
      .then(() => {
        handleRefresh({
          page: (list.length === selectedRowKeys.length && pagination.current > 1) ? pagination.current - 1 : pagination.current,
        })
      })
  }

  const operations = <Button type="primary" onClick={onEdit}>新建</Button>

  return (
    <Page inner>
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`选中 ${selectedRowKeys.length} 目标 `}
            <Popconfirm title={'确定删除这些目标?'} placement="left" onConfirm={handleDeleteItems}>
               <Button type="danger" size="large" style={{ marginLeft: 8 }}>删除</Button>
             </Popconfirm>
          </Col>
        </Row>
      }
      <Tabs activeKey={queryActive(query.status)} onTabClick={handleTabClick} tabBarExtraContent={operations}>
        <TabPane tab={<span><Icon type="book" />已发布</span>} key={String(EnumPostStatus.PUBLISHED)}>
          <List {...listProps} />
        </TabPane>
        <TabPane tab={<span><Icon type="edit" />草稿</span>} key={String(EnumPostStatus.UNPUBLISH)}>
          <List {...listProps} />
        </TabPane>
        <TabPane tab={<span><Icon type="delete" />回收站</span>} key={String(EnumPostStatus.DELETED)}>
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </Page>
  )
}

Content.propTypes = {
  content: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ content, loading }) => ({ content, loading }))(Content)
