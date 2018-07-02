import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Upload, Icon, message } from 'antd'
import { auth, config } from 'utils'

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

class modal extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = ({ fileList }) => {
    fileList = fileList.filter((file) => {
      if (file.response) {
        const status = file.response.code === '0000'
        if (!status) {
          message.error(file.response.message)
        }
        return status
      }
      return true
    })
    this.setState({ fileList })
  }

  render () {
    const {
      item = {},
      groupList = [],
      onOk,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
      },
      modalType,
      ...modalProps
    } = this.props

    const { previewVisible, previewImage, fileList } = this.state

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
          key: item.key,
        }
        if (fileList.length) {
          data.avatar = fileList[0].response.result[0].path
        }
        onOk(data)
      })
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleOk,
    }

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )

    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="头像" hasFeedback {...formItemLayout}>
            <Upload
              action={config.api.media}
              headers={{
                authorization: auth.get(),
                'media-type': 'image',
              }}
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {!fileList.length && uploadButton}
            </Upload>
          </FormItem>
          <FormItem label="E-mail" hasFeedback {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: item.email,
              rules: [
                {
                  pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: '请输入正确的邮箱地址!',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="昵称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('nickname', {
              initialValue: item.nickname,
              rules: [
                {
                  required: modalType !== 'update',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="手机号" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mobile', {
              initialValue: item.mobile,
              rules: [
                {
                  pattern: /^1[3|4|5|7|8]\d{9}$/,
                  message: '请输入正确的手机号!',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="用户组" hasFeedback {...formItemLayout}>
            {getFieldDecorator('group', {
              initialValue: item.group ? item.group._id : null,
            })(
              <Select>
                {groupList.map((item, key) => <Option key={key} value={item._id}>{item.name}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem label={modalType === 'update' ? '新密码' : '密码'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: modalType !== 'update',
                },
              ],
            })(<Input type="password" />)}
          </FormItem>
        </Form>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Modal>
    )
  }
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  modalType: PropTypes.string,
}

export default Form.create()(modal)
