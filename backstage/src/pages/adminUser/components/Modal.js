import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'

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

const modal = ({
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
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
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
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  modalType: PropTypes.string,
}

export default Form.create()(modal)
