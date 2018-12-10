import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { connect } from 'dva'
import { Form, Input, Tag, Tooltip, Button, Card, TreeSelect, Switch } from 'antd'
import { BraftEditor } from 'components'
import { withI18n } from '@lingui/react'

const FormItem = Form.Item
const ButtonGroup = Button.Group
const { TreeNode } = TreeSelect
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

@withI18n()
@connect(({ articleDetail, loading }) => ({ articleDetail, loading }))
@Form.create()
class ArticleDetail extends PureComponent {
  editorInstance = null
  constructor (props) {
    super(props)
    this.state = {
      tags: [],
      inputVisible: false,
      inputValue: '',
      editorState: BraftEditor.createEditorState(null),
    }
  }

  static getDerivedStateFromProps (props, state) {
    const { detail } = props.articleDetail
    if (!isEmpty(detail) && !isEmpty(detail.tags) && isEmpty(state.tags)) {
      return {
        tags: detail.tags,
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

  handleOk = (status) => {
    const { form, dispatch, articleDetail } = this.props
    const { validateFieldsAndScroll } = form
    const { detail } = articleDetail
    const { tags } = this.state

    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({
        type: 'articleDetail/update',
        payload: {
          _id: detail._id,
          ...values,
          status,
          tags,
          content: this.editorInstance.getValue().toHTML(),
        },
      })
    })
  }

  render() {
    const { articleDetail, i18n, form } = this.props
    const { getFieldDecorator } = form
    const { detail, categoryList } = articleDetail

    const { tags, inputVisible, inputValue } = this.state

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
        <FormItem label={i18n.t`名称`} hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
          initialValue: detail.title,
        })(<Input />)}
        </FormItem>
        <FormItem label={i18n.t`描述`} hasFeedback {...formItemLayout}>
          {getFieldDecorator('category', {
            initialValue: detail.category,
          })(
            <TreeSelect
              allowClear
              treeDefaultExpandAll
              onChange={this.onChange}
            >
              {loop(categoryList)}
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
            initialValue: detail.subTitle,
          })(<TextArea autosize={textAreaSize} />)}
        </FormItem>
        <FormItem label="是否原创" {...formItemLayout}>
          {getFieldDecorator('original', {
            valuePropName: 'checked',
            initialValue: detail.original,
          })(<Switch />)}
        </FormItem>
        <FormItem label="是否置顶" {...formItemLayout}>
          {getFieldDecorator('isTop', {
            valuePropName: 'checked',
            initialValue: detail.isTop,
          })(<Switch />)}
        </FormItem>
        <Card title="文章内容">
          <BraftEditor
            ref={instance => this.editorInstance = instance}
            defaultValue={BraftEditor.createEditorState(detail.content)}
            contentId={detail._id}
          />
        </Card>
        <ButtonGroup size="large" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button type="primary" icon="upload" onClick={() => this.handleOk(EnumPostStatus.PUBLISHED)}>发布</Button>
          <Button type="danger" icon="cloud-download-o" onClick={() => this.handleOk(EnumPostStatus.UNPUBLISH)}>草稿</Button>
        </ButtonGroup>
      </Form>
    )
  }
}

ArticleDetail.propTypes = {
  articleDetail: PropTypes.object,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default ArticleDetail
