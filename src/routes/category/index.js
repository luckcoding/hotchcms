import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import lodash from 'lodash'
import { Tree, Button } from 'antd'
import Modal from './Modal'

const TreeNode = Tree.TreeNode

const Category = ({ category, loading, dispatch }) => {
  const { tree, modalType, currentItem, modalVisible } = category

  const modalProps = {
    modalType,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['category/update'],
    title: `${modalType === 'create' ? '创建分类' : '编辑分类'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `category/${modalType}`,
        payload: data,
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

  const onRightClick = function ($event, node) {
    console.log('onRightClick', $event, node)
  }

  const onDragStart = function ($event, node) {
    console.log('onDragStart', $event, node)
  }

  const onDragEnd = function ($event, node) {
    console.log('onDragEnd', $event, node)
  }

  const onSelect = function (selectedKeys, $event) {
    if (!lodash.isEmpty(selectedKeys)) {
      dispatch({
        type: 'category/showModal',
        payload: {
          modalType: 'edit',
          currentItem: $event.node.props.dataSource,
        },
      })
    }
  }

  const expandedKeys = []

  const loop = data => data.map((item) => {
    if (item.children) {
      expandedKeys.push(item._id)
      return (
        <TreeNode key={item._id} title={item.name} disabled={!item.state} dataSource={item}>
          {loop(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode key={item._id} title={item.name} disabled={!item.state} dataSource={item} />
  })

  return (
    <div className="content-inner">
      <Button type="primary" size="large" style={{
        position: 'absolute',
        right: 0,
        top: -48,
      }} onClick={onAdd}
      >添加分类</Button>

      <Tree
        defaultExpandAll
        draggable
        expandedKeys={expandedKeys}
        onRightClick={onRightClick}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onSelect={onSelect}
      >
        {loop(tree)}
      </Tree>
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Category.propTypes = {
  category: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ category, loading }) => ({ category, loading }))(Category)
