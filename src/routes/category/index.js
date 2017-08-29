import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import lodash from 'lodash'
import { Tree, Button } from 'antd'
import Modal from './Modal'

const TreeNode = Tree.TreeNode
const ButtonGroup = Button.Group

const Category = ({ category, loading, dispatch }) => {
  const { tree, modalType, currentItem, checkItems, modalVisible } = category

  const modalProps = {
    modalType,
    item: modalType === 'create' ? {} : currentItem,
    tree,
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

  const onCheck = (expandedKeys) => {
    const { checked } = expandedKeys
    dispatch({
      type: 'category/onCheckItems',
      payload: checked,
    })
  }

  const onSelect = (selectedKeys, e) => {
    if (!lodash.isEmpty(selectedKeys)) {
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
    <div className="content-inner" style={{ display: 'flex', justifyContent: 'space-between' }}>
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

      <ButtonGroup>
        <Button onClick={onRemve} disabled={lodash.isEmpty(checkItems)}>删除所选</Button>
        <Button onClick={onAdd}>添加分类</Button>
      </ButtonGroup>
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
