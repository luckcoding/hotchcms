import React from 'react'
import keyBy from 'lodash/keyBy'
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
  authority = [],
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  modalType,
  ...modalProps
}) => {

  // 解析权限对应传值
  const decode = (authorities) => {
    let output = []
    const authPrefix = keyBy(authority, 'prefix')
    authorities.forEach(function (item) {
      if (authPrefix[item] && authPrefix[item].value) {
        output.push(authPrefix[item].value)
      }
    })
    return output
  }

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }

      const data = {
        ...getFieldsValue(),
        key: item.key,
      }

      data.authorities = decode(data.authorities)
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
        <FormItem label="名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [
              {
                required: modalType !== 'update',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="级别" hasFeedback {...formItemLayout}>
          {getFieldDecorator('gradation', {
            initialValue: item.gradation,
            rules: [
              {
                required: modalType !== 'update',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="权限" hasFeedback {...formItemLayout}>
          {getFieldDecorator('authorities', {
            initialValue: Array.isArray(item.authority) ? item.authority.map(_ => _.prefix) : [],
          })(
            <Select mode="multiple">
              {authority.map((item, key) => (
                <Option key={key} value={item.prefix}>{item.name}</Option>
              ))}
            </Select>
          )}
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
