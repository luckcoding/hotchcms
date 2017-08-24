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
  modalType,
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
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

  function handleChange (value) {
    console.log(`selected ${value}`)
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        {
          modalType !== 'update' &&
          <FormItem label="E-mail" hasFeedback {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: item.email,
              rules: [
                {
                  required: modalType !== 'update',
                  pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: '请输入正确的邮箱地址!',
                },
              ],
            })(<Input />)}
          </FormItem>
        }
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
                required: modalType !== 'update',
                pattern: /^1[3|4|5|7|8]\d{9}$/,
                message: '请输入正确的手机号!',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="用户组" hasFeedback {...formItemLayout}>
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </FormItem>
        <FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            initialValue: item.password,
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
  modalType: PropTypes.string,
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
