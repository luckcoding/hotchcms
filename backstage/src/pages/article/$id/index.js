import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import { connect } from 'dva'
import { Form, Input, Tag, Tooltip, Button, Card, TreeSelect, Upload, Icon, Modal, message } from 'antd'
import { BraftEditor } from 'components'
import { withI18n, Trans } from '@lingui/react'
import { auth, config } from 'utils'
import { getMediaUrl, handleFileListUrl } from 'utils/helpers'

const { mediaApiUrl } = config

const FormItem = Form.Item
const ButtonGroup = Button.Group
const { TreeNode } = TreeSelect
const { TextArea } = Input

const EnumPostStatus = {
  PUBLISHED: 1, // 已发布
  UNPUBLISH: 2, // 已下线
  DRAFT: 0, // 草稿
  TRASH: 9, // 回收站
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
      previewVisible: false,
      previewImage: '',
      fileList: [],

      initial: {},
    }
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {}

  static getDerivedStateFromProps (nextProps, prevState) {

    const { detail } = nextProps.articleDetail

    let nextExtendsState = null

    if (!isEqual(detail, prevState.initial)) {
      nextExtendsState = {
        ...prevState,
        initial: detail,
        tags: detail.tags || [],
      }

      if (detail.cover) {
        nextExtendsState.fileList = [
          {
            uid: '-1',
            status: 'done',
            url: detail.cover,
          }
        ]
      }
    }

    return nextExtendsState
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

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = file => {
    this.setState({
      previewImage: getMediaUrl(file.url) || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = ({ fileList }) => {
    fileList = fileList.filter(file => {
      if ((file.status === 'done') && file.response) {
        const status = file.response.code === '0000'
        if (!status) {
          message.error(file.response.message)
        } else {
          file.url = file.response.result[0].path
        }
        return status
      }
      return true
    })

    this.setState({ fileList })
  }

  handleOk = (status) => {
    const { form, dispatch, articleDetail } = this.props
    const { validateFieldsAndScroll } = form
    const { detail } = articleDetail
    const { tags, fileList } = this.state

    form.getFieldValue('password')

    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }

      const data = {
        _id: detail._id,
        ...values,
        status,
        tags,
        content: this.editorInstance.getValue().toHTML(),
      }

      if (fileList.length) {
        data.cover = fileList[0].url
      } else {
        data.cover = ''
      }

      dispatch({
        type: 'articleDetail/update',
        payload: data
      })
    })
  }

  render() {
    const { articleDetail, i18n, form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const { detail, categoryList } = articleDetail

    const originalAuthor = getFieldValue('originalAuthor')

    const { tags, inputVisible, inputValue, previewVisible, previewImage, fileList } = this.state

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
        <FormItem label={i18n.t`Title`} hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
          initialValue: detail.title,
        })(<Input />)}
        </FormItem>
        <FormItem label={i18n.t`Category`} hasFeedback {...formItemLayout}>
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
        <FormItem label={i18n.t`Tags`} hasFeedback {...formItemLayout}>
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
        <FormItem label={i18n.t`Cover`} hasFeedback {...formItemLayout}>
          <Upload
            className="cover"
            action={mediaApiUrl}
            headers={{
              authorization: auth.get(),
              'media-type': 'image',
            }}
            listType="picture-card"
            fileList={handleFileListUrl(fileList)}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {!fileList.length && (
              <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem label={i18n.t`原作者`}  {...formItemLayout}>
          {getFieldDecorator('originalAuthor', {
            initialValue: detail.originalAuthor,
          })(<Input placeholder="填写后，将证明文章来自转载" />)}
        </FormItem>
        {originalAuthor && (
          <FormItem label={i18n.t`原地址`}  {...formItemLayout}>
            {getFieldDecorator('originalUrl', {
              initialValue: detail.originalUrl,
            })(<Input />)}
          </FormItem>
        )}
        <FormItem label={i18n.t`Overview`} hasFeedback {...formItemLayout}>
          {getFieldDecorator('overview', {
            initialValue: detail.overview,
          })(<TextArea autosize={textAreaSize} />)}
        </FormItem>
        <Card label={i18n.t`Content`}>
          {detail._id && (
            <BraftEditor
              ref={instance => this.editorInstance = instance}
              defaultValue={BraftEditor.createEditorState(detail.content)}
              contentId={detail._id}
              language={i18n._language === 'en' ? 'en' : 'zh'}
            />
          )}
        </Card>
        <ButtonGroup style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', position: 'sticky', bottom: '20px', zIndex: '2' }}>
          <Button type="primary" icon="upload" onClick={() => this.handleOk(EnumPostStatus.PUBLISHED)}><Trans>Publish</Trans></Button>
          <Button icon="lock" onClick={() => this.handleOk(EnumPostStatus.UNPUBLISH)}><Trans>UnPublish</Trans></Button>
          <Button type="danger" icon="cloud-download-o" onClick={() => this.handleOk(EnumPostStatus.DRAFT)}><Trans>Draft</Trans></Button>
        </ButtonGroup>

        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
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
