import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Form, Input, Tag, Tooltip, Button } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
}

class Setting extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tags: props.setting.siteInfo.keywords || [],
      inputVisible: false,
      inputValue: '',
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.setting.siteInfo.keywords) {
      this.setState({ tags: nextProps.setting.siteInfo.keywords })
    }
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
      setting = {},
      form: {
        getFieldDecorator,
        validateFieldsAndScroll,
      },
    } = this.props

    const { siteInfo } = setting

    const { tags, inputVisible, inputValue } = this.state

    const handleOk = () => {
      validateFieldsAndScroll((errors, values) => {
        if (errors) return null
        return this.props.dispatch({
          type: 'setting/save',
          payload: {
            ...values,
            keywords: tags,
          },
        })
      })
    }

    return (
      <Form layout="horizontal">
        <FormItem label="网站标题" hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: siteInfo.title,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
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
        <FormItem label="网站描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: siteInfo.description,
            rules: [
              {
                required: true,
              },
            ],
          })(<TextArea autosize={{ minRows: 4, maxRows: 8 }} />)}
        </FormItem>
        <FormItem label="顶部代码块" hasFeedback {...formItemLayout}>
          {getFieldDecorator('headerCode', {
            initialValue: siteInfo.headerCode,
          })(<TextArea autosize={{ minRows: 4, maxRows: 8 }} />)}
        </FormItem>
        <FormItem label="底部代码块" hasFeedback {...formItemLayout}>
          {getFieldDecorator('footerCode', {
            initialValue: siteInfo.footerCode,
          })(<TextArea autosize={{ minRows: 4, maxRows: 8 }} />)}
        </FormItem>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" onClick={handleOk}>设置</Button>
        </div>
      </Form>
    )
  }
}

Setting.propTypes = {
  form: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  setting: PropTypes.object,
}

export default connect(({ setting }) => ({ setting }))(Form.create()(Setting))
