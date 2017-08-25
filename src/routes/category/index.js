import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tree, Button, Popover } from 'antd'
import Modal from './Modal'

const TreeNode = Tree.TreeNode
const ButtonGroup = Button.Group

const Category = ({ category, loading, dispatch }) => {
  const { tree, modalType, currentItem, modalVisible } = category

  const modalProps = {
    modalType,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['category/update'],
    title: `${modalType === 'create' ? '创建分类' : '更新分类'}`,
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

  const onAdd = function () {
    dispatch({
      type: 'category/showModal',
      payload: {
        modalType: 'create',
      },
    })
  }

  // onDeleteItem (id) {
  //   dispatch({
  //     type: 'adminUser/delete',
  //     payload: id,
  //   })
  // },

  // onEditItem (item) {
  //   dispatch({
  //     type: 'adminUser/showModal',
  //     payload: {
  //       modalType: 'update',
  //       currentItem: item,
  //     },
  //   })
  // },

  const onRightClick = function ($event, node) {
    console.log('onRightClick', $event, node)
  }

  const onDragStart = function ($event, node) {
    console.log('onDragStart', $event, node)
  }

  const onDragEnd = function ($event, node) {
    console.log('onDragEnd', $event, node)
  }

  const expandedKeys = []

  const loop = data => data.map((item) => {
    const editEle = (<Popover content={<ButtonGroup><Button>更新</Button><Button type="danger">删除</Button></ButtonGroup>}>
      {item.name}
    </Popover>)

    if (item.children) {
      expandedKeys.push(item._id)
      return (
        <TreeNode key={item._id} title={editEle} disabled={!item.state}>
          {loop(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode key={item._id} title={editEle} disabled={!item.state} />
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
