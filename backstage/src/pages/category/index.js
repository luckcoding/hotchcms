import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
// import isEmpty from 'lodash/isEmpty'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

// const TreeNode = Tree.TreeNode
// const ButtonGroup = Button.Group

const Category = ({
  dispatch, category, loading,
}) => {
  const {
    list, currentItem, modalVisible, modalType, selectedRowKeys,
  } = category

  const modalProps = {
    modalType,
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
    },
    onCancel () {
      dispatch({
        type: 'category/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['category/query'],
    onDeleteItem (id) {
      dispatch({
        type: 'category/delete',
        payload: id,
      })
    },
    onEditItem (item) {
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
      onChange: (keys) => {
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
    onAdd () {
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
      },
    })
  }

  // const onAdd = () => {
  //   dispatch({
  //     type: 'category/showModal',
  //     payload: {
  //       modalType: 'create',
  //     },
  //   })
  // }

  // const onCheck = (expandedKeys) => {
  //   const { checked } = expandedKeys
  //   dispatch({
  //     type: 'category/onCheckItems',
  //     payload: checked,
  //   })
  // }

  // const onSelect = (selectedKeys, e) => {
  //   if (!isEmpty(selectedKeys)) {
  //     dispatch({
  //       type: 'category/showModal',
  //       payload: {
  //         modalType: 'update',
  //         currentItem: e.node.props.dataSource,
  //       },
  //     })
  //   }
  // }

  // const onRemve = () => {
  //   dispatch({
  //     type: 'category/multiDelete',
  //   })
  // }

  // const expandedKeys = []

  // const loop = data => data.map((item) => {
  //   const title = <span style={{ textDecoration: !item.state && 'line-through' }}>{item.name}</span>
  //   if (item.children) {
  //     expandedKeys.push(item._id)
  //     return (
  //       <TreeNode key={item._id} title={title} dataSource={item}>
  //         {loop(item.children)}
  //       </TreeNode>
  //     )
  //   }
  //   return <TreeNode key={item._id} title={title} dataSource={item} />
  // })

  return (
    <Page inner>
      {/*<Tree
        checkable
        checkStrictly
        defaultExpandAll
        expandedKeys={expandedKeys}
        onCheck={onCheck}
        onSelect={onSelect}
      >
        {loop(categories)}
      </Tree>

      <ButtonGroup style={{marginTop: 20}}>
        <Button onClick={onRemve} disabled={isEmpty(checkItems)}>删除所选</Button>
        <Button onClick={onAdd}>添加分类</Button>
      </ButtonGroup>*/}
      <Filter {...filterProps} />
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
      <List {...listProps} />
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
