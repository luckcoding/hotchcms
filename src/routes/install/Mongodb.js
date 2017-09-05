import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const Mongodb = ({
  onOk,
  form: {
    getFieldDecorator, // 双向绑定
    validateFieldsAndScroll, // 校验不通过的菜单域不在可见范围内，则自动滚动进可见范围
  },
}) => {
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) return null
      return onOk(values)
    })
  }

  return (
    <Form>
      <FormItem
        {...formItemLayout}
        label="主机地址"
        hasFeedback
        extra="默认 localhost"
      >
        {getFieldDecorator('host', {
          initialValue: 'localhost',
          rules: [{
            pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$|^localhost$/,
            message: '格式错误',
          }, {
            required: true,
          }],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="端口"
        hasFeedback
        extra="默认 27017"
      >
        {getFieldDecorator('port', {
          initialValue: '27017',
          rules: [{
            pattern: /\d/,
            message: '格式错误',
          }, {
            required: true,
          }],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="数据库名"
        hasFeedback
      >
        {getFieldDecorator('db', {
          rules: [{
            required: true,
          }],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="数据库账户名"
        hasFeedback
      >
        {getFieldDecorator('user')(<Input />)}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="数据库密码"
        hasFeedback
      >
        {getFieldDecorator('pass')(<Input type="password" />)}
      </FormItem>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" onClick={handleOk}>检测</Button>
      </div>
    </Form>
  )
}

Mongodb.propTypes = {
  form: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(Mongodb)
