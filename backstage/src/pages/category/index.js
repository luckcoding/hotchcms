import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Tree, Button } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import isEmpty from 'lodash/isEmpty'
import Modal from './components/Modal'

const TreeNode = Tree.TreeNode
const ButtonGroup = Button.Group

const Category = ({
  location, dispatch, category, loading,
}) => {
  const { query, pathname } = location
  const {
    tree, checkItems, currentItem, modalVisible, modalType,
  } = category

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
    modalType,
    tree,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`category/${modalType}`],
    title: `${modalType === 'create' ? '创建分类' : '编辑分类'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `category/${modalType}`,
        payload: data,
      })
        .then(() => {
          handleRefresh()
        })
    },
    onCancel () {
      dispatch({
        type: 'category/hideModal',
      })
    },
  }

  const onAdd = () => {
    dispatch({
      type: 'category/showModal',
      payload: {
        modalType: 'create',
      },
    })
  }

  const onCheck = (expandedKeys) => {
    const { checked } = expandedKeys
    dispatch({
      type: 'category/onCheckItems',
      payload: checked,
    })
  }

  const onSelect = (selectedKeys, e) => {
    if (!isEmpty(selectedKeys)) {
      dispatch({
        type: 'category/showModal',
        payload: {
          modalType: 'update',
          currentItem: e.node.props.dataSource,
        },
      })
    }
  }

  const onRemve = () => {
    dispatch({
      type: 'category/multiDelete',
    })
  }

  const expandedKeys = []

  const loop = data => data.map((item) => {
    const title = <span style={{ textDecoration: !item.state && 'line-through' }}>{item.name}</span>
    if (item.children) {
      expandedKeys.push(item._id)
      return (
        <TreeNode key={item._id} title={title} dataSource={item}>
          {loop(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode key={item._id} title={title} dataSource={item} />
  })

  return (
    <Page inner>
      <Tree
        checkable
        checkStrictly
        defaultExpandAll
        expandedKeys={expandedKeys}
        onCheck={onCheck}
        onSelect={onSelect}
      >
        {loop(tree)}
      </Tree>

      <ButtonGroup style={{marginTop: 20}}>
        <Button onClick={onRemve} disabled={isEmpty(checkItems)}>删除所选</Button>
        <Button onClick={onAdd}>添加分类</Button>
      </ButtonGroup>
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

Category.propTypes = {
  category: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ category, loading }) => ({ category, loading }))(Category)
