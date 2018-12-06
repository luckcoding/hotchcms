import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import { Form, Input, Tag, Tooltip, Button, Card, TreeSelect, Switch } from 'antd'
import { Editor } from 'components'

const FormItem = Form.Item
const ButtonGroup = Button.Group
const TreeNode = TreeSelect.TreeNode
const { TextArea } = Input

const EnumPostStatus = {
  UNPUBLISH: 0,
  PUBLISHED: 1,
  DELETED: 2,
}

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
      tags: [],
      inputVisible: false,
      inputValue: '',
      editorState: '',
    }
    this.editorInstance = null
  }

  static getDerivedStateFromProps (nextProps) {
    if (!isEmpty(nextProps.article)) {
      const { tags } = nextProps.article
      return {
        tags,
      }
    } else {
      return null
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
      form: {
        getFieldDecorator,
        validateFieldsAndScroll,
      },
      article = {},
      tree = [],
      dispatch,
    } = this.props

    const { tags, inputVisible, inputValue } = this.state

    const handleOk = (status) => {
      validateFieldsAndScroll((errors, values) => {
        if (status && errors) return null
        dispatch({
          type: 'articleDetail/update',
          payload: {
            _id: article._id,
            ...values,
            status,
            tags,
            content: this.editorInstance.getHTMLContent(),
          },
        })
      })
    }

    const loop = data => data.map((i) => {
      const title = <span style={{ textDecoration: !i.state && 'line-through' }}>{i.name}</span>
      return (
        <TreeNode key={i._id} title={title} value={i._id}>
          {i.children && loop(i.children)}
        </TreeNode>
      )
    })

    return (
      <Form layout="horizontal">
        <FormItem label="文章标题" hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: article.title,
          })(<Input />)}
        </FormItem>
        <FormItem label="类别" hasFeedback {...formItemLayout}>
          {getFieldDecorator('category', {
            initialValue: article.category,
          })(
            <TreeSelect
              allowClear
              treeDefaultExpandAll
              onChange={this.onChange}
            >
              {loop(tree)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem label="标签" hasFeedback {...formItemLayout}>
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
        <FormItem label="概述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('subTitle', {
            initialValue: article.subTitle,
          })(<TextArea autosize={textAreaSize} />)}
        </FormItem>
        <FormItem label="是否原创" {...formItemLayout}>
          {getFieldDecorator('original', {
            valuePropName: 'checked',
            initialValue: article.original,
          })(<Switch />)}
        </FormItem>
        <FormItem label="是否置顶" {...formItemLayout}>
          {getFieldDecorator('isTop', {
            valuePropName: 'checked',
            initialValue: article.isTop,
          })(<Switch />)}
        </FormItem>
        <Card title="文章内容">
          <Editor
            ref={instance => this.editorInstance = instance}
            contentFormat="html"
            initialContent={article.content}
            contentId={article._id}
          />
        </Card>
        <ButtonGroup size="large" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button type="primary" icon="upload" onClick={() => handleOk(EnumPostStatus.PUBLISHED)}>发布</Button>
          <Button type="danger" icon="cloud-download-o" onClick={() => handleOk(EnumPostStatus.UNPUBLISH)}>草稿</Button>
        </ButtonGroup>
      </Form>
    )
  }
}

Edit.propTypes = {
  form: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  article: PropTypes.object,
  tree: PropTypes.array,
}

export default connect(({ articleDetail }) => ({
  article: articleDetail.article,
  tree: articleDetail.tree,
}))(Form.create()(Edit))
