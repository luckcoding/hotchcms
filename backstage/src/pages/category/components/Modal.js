import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, TreeSelect, Switch, InputNumber, Tag, Tooltip, Button } from 'antd'

const FormItem = Form.Item
const TextArea = Input.TextArea
const TreeNode = TreeSelect.TreeNode

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

class modal extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      tags: props.item.keywords || [],
      inputVisible: false,
      inputValue: '',
      uid: props.item.uid,
    }
  }

  onChange = (uid) => {
    this.setState({ uid })
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag)
    this.setState({ tags })
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm = () => {
    const state = this.state
    const inputValue = state.inputValue
    let tags = state.tags
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue]
    }

    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    })
  }

  saveInputRef = (input) => {
    this.input = input
  }

  render () {
    const {
      modalType,
      tree = [],
      item = {},
      onOk,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
      },
      ...modalProps
    } = this.props

    const { tags, uid, inputVisible, inputValue } = this.state

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
          keywords: tags,
          uid,
        }
        onOk(data)
      })
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleOk,
    }

    const loop = data => data.map((i) => {
      const title = <span style={{ textDecoration: !i.state && 'line-through' }}>{i.name}</span>
      const disabled = i._id === item._id
      if (i.children) {
        return (
          <TreeNode key={i._id} title={title} disabled={disabled} value={i._id}>
            {loop(i.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={i._id} title={title} disabled={disabled} value={i._id} />
    })

    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="所属" hasFeedback {...formItemLayout}>
            <TreeSelect
              value={this.state.uid}
              allowClear
              treeDefaultExpandAll
              placeholder="不选代表顶级分类"
              onChange={this.onChange}
            >
              {loop(tree)}
            </TreeSelect>
          </FormItem>
          <FormItem label="名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: modalType !== 'update',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="别名" hasFeedback {...formItemLayout}>
            {getFieldDecorator('path', {
              initialValue: item.path,
              rules: [
                {
                  required: modalType !== 'update',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="是否首页" {...formItemLayout}>
            {getFieldDecorator('isHome', {
              valuePropName: 'checked',
              initialValue: item.isHome,
            })(<Switch />)}
          </FormItem>
          <FormItem label="导航显示" {...formItemLayout}>
            {getFieldDecorator('state', {
              valuePropName: 'checked',
              initialValue: item.state,
            })(<Switch />)}
          </FormItem>
          <FormItem label="排序" hasFeedback {...formItemLayout}>
            {getFieldDecorator('sort', {
              initialValue: item.sort,
              rules: [
                {
                  required: modalType !== 'update',
                },
              ],
            })(<InputNumber min={1} max={100} />)}
          </FormItem>
          <FormItem label="关键词" hasFeedback {...formItemLayout}>
            {tags.map((tag) => {
              const isLongTag = tag.length > 20
              const tagElem = (
                <Tag key={tag} closable afterClose={() => this.handleClose(tag)}>
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </Tag>
              )
              return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem
            })}
            {inputVisible && (
              <Input
                ref={this.saveInputRef}
                type="text"
                size="small"
                style={{ width: 78 }}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            )}
            {!inputVisible && <Button size="small" type="dashed" onClick={this.showInput}>+</Button>}
          </FormItem>
          <FormItem label="描述" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
            })(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

modal.propTypes = {
  modalType: PropTypes.string,
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  tree: PropTypes.array,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
