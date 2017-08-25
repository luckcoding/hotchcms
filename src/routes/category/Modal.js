import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Switch, InputNumber, Tag, Tooltip, Button } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

class modal extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
  };

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag)
    console.log(tags)
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
    console.log(tags)
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
      item = {},
      onOk,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
      },
      ...modalProps
    } = this.props

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
        }
        for (let key in data) {
          if (data[key] === '') {
            delete data[key]
          }
        }
        onOk(data)
      })
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleOk,
    }

    const { tags, inputVisible, inputValue } = this.state

    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal">
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
          <FormItem label="是否首页" hasFeedback {...formItemLayout}>
            <Switch defaultChecked={false} />
          </FormItem>
          <FormItem label="导航显示" hasFeedback {...formItemLayout}>
            <Switch defaultChecked />
          </FormItem>
          <FormItem label="排序" hasFeedback {...formItemLayout}>
            {getFieldDecorator('sort', {
              initialValue: item.sort,
              rules: [
                {
                  required: modalType !== 'update',
                },
              ],
            })(<InputNumber min={1} max={100} defaultValue={item.sort} />)}
          </FormItem>
          <FormItem label="关键词" hasFeedback {...formItemLayout}>
            {getFieldDecorator('keywords', {
              initialValue: item.keywords,
              rules: [
                {
                  required: modalType !== 'update',
                },
              ],
            })(<div>

              {tags.map((tag) => {
                const isLongTag = tag.length > 20
                const tagElem = (
                  <Tag key={tag} afterClose={() => this.handleClose(tag)}>
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
            </div>)}
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
  onOk: PropTypes.func,
}

export default Form.create()(modal)
