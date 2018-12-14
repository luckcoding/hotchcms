import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Upload, Icon, message } from 'antd'
import { withI18n } from '@lingui/react'
import { auth, config } from 'utils'
import { getMediaUrl } from 'utils/helpers'

const { mediaApiUrl } = config

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
@withI18n()
@Form.create()
class UserModal extends PureComponent {
  constructor(props) {
    super(props)

    let fileList = []

    if (props.item.avatar) {
      fileList.push({
        uid: '-1',
        status: 'done',
        url: getMediaUrl(props.item.avatar),
      })
    }

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList,
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = ({ fileList }) => {
    fileList = fileList.filter(file => {
      if (file.status === 'done' && file.response) {
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

  handleOk = () => {
    const { item = {}, onOk, form } = this.props
    const { validateFields, getFieldsValue } = form

    const { fileList } = this.state

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      if (fileList.length) {
        data.avatar = fileList[0].url
      } else {
        data.avatar = ''
      }
      onOk(data)
    })
  }

  render() {
    const {
      item = {},
      onOk,
      form,
      i18n,
      modalType,
      allAdminGroupList = [],
      ...modalProps
    } = this.props
    const { getFieldDecorator } = form

    const { previewVisible, previewImage, fileList } = this.state

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label={i18n.t`Avatar`} hasFeedback {...formItemLayout}>
            <Upload
              action={mediaApiUrl}
              headers={{
                authorization: auth.get(),
                'media-type': 'image',
              }}
              listType="picture-card"
              fileList={fileList}
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
          <FormItem label={i18n.t`Email`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: item.email,
              rules: [
                {
                  pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: i18n.t`Pls input the right Email`,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`NickName`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('nickname', {
              initialValue: item.nickname,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Phone`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('mobile', {
              initialValue: item.mobile,
              rules: [
                {
                  pattern: /^1[3|4|5|7|8]\d{9}$/,
                  message: 'Pls input the right Phone',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Admin Group`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('group', {
              initialValue: item.group ? item.group._id : null,
            })(
              <Select>
                {allAdminGroupList.map((item, key) => (
                  <Option key={key} value={item._id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            label={
              modalType === 'update' ? i18n.t`New Password` : i18n.t`Password`
            }
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  required: modalType !== 'update',
                },
              ],
            })(<Input type="password" />)}
          </FormItem>
        </Form>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Modal>
    )
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  allAdminGroupList: PropTypes.array.isRequired,
  modalType: PropTypes.string.isRequired,
  onOk: PropTypes.func,
}

export default UserModal
