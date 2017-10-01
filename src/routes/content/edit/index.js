import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
// import { convertToRaw } from 'draft-js'
import { Form, Input, Tag, Tooltip, Button, Card, TreeSelect } from 'antd'
import { Editor } from '../../../components'

const FormItem = Form.Item
const ButtonGroup = Button.Group
const TreeNode = TreeSelect.TreeNode
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
}

const textAreaSize = {
  minRows: 2,
  maxRows: 4,
}

class Edit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tags: props.content.keywords || [],
      inputVisible: false,
      inputValue: '',
      editorContent: null,
      category: props.content.category,
    }
  }

  // componentWillReceiveProps (nextProps) {
  //   if (props.contentDetail.content.keywords) {
  //     this.setState({ tags: nextProps.contentDetail.content.keywords })
  //   }
  // }

  onChange = (category) => {
    this.setState({ category })
  }

  onEditorStateChange = (editorContent) => {
    this.setState({
      editorContent,
    })
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
      // contentDetail = {},
      form: {
        getFieldDecorator,
        validateFieldsAndScroll,
      },
      content = {},
      tree = [],
    } = this.props

    // const { tree, content } = contentDetail

    const { tags, inputVisible, inputValue, editorContent } = this.state

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

    const loop = data => data.map((i) => {
      const title = <span style={{ textDecoration: !i.state && 'line-through' }}>{i.name}</span>

      // const disabled = i._id === item._id
      const disabled = false
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
      <div>
        <Form layout="horizontal">
          <FormItem label="文章标题" hasFeedback {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: content.title,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="所属" hasFeedback {...formItemLayout}>
            <TreeSelect
              value={this.state.category}
              allowClear
              treeDefaultExpandAll
              placeholder="不选代表顶级分类"
              onChange={this.onChange}
            >
              {loop(tree)}
            </TreeSelect>
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
              initialValue: content.description,
              rules: [
                {
                  required: true,
                },
              ],
            })(<TextArea autosize={textAreaSize} />)}
          </FormItem>
          <FormItem label="顶部代码块" hasFeedback {...formItemLayout}>
            {getFieldDecorator('headerCode', {
              initialValue: content.headerCode,
            })(<TextArea autosize={textAreaSize} />)}
          </FormItem>
          <FormItem label="概述" hasFeedback {...formItemLayout}>
            {getFieldDecorator('subtitle', {
              initialValue: content.subtitle,
            })(<TextArea autosize={textAreaSize} />)}
          </FormItem>
          <FormItem label="概述" hasFeedback {...formItemLayout}>
            {getFieldDecorator('subtitle', {
              initialValue: content.subtitle,
            })(<TextArea autosize={textAreaSize} />)}
          </FormItem>
          <Card title="文章内容">
            <Editor
              wrapperStyle={{ minHeight: 500 }}
              editorStyle={{ minHeight: 376 }}
              editorState={editorContent}
              onEditorStateChange={this.onEditorStateChange}
            />
          </Card>
          <ButtonGroup size="large" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button type="primary" icon="upload" onClick={handleOk}>发布</Button>
            <Button type="danger" icon="cloud-download-o" onClick={handleOk}>草稿</Button>
          </ButtonGroup>
        </Form>
      </div>
    )
  }
}

Edit.propTypes = {
  form: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  content: PropTypes.object,
  tree: PropTypes.array,
}

const mapStateToProps = ({ contentDetail }) => {
  const { content, tree } = contentDetail
  return {
    content,
    tree,
  }
}

export default connect(mapStateToProps)(Form.create()(Edit))
