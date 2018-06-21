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

const Redis = ({
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
        extra="默认 6379"
      >
        {getFieldDecorator('port', {
          initialValue: '6379',
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
        extra="默认 0"
      >
        {getFieldDecorator('db', {
          initialValue: '0',
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
        label="family"
        hasFeedback
        extra="默认 IPv4"
      >
        {getFieldDecorator('family', {
          initialValue: 'IPv4',
          rules: [{
            pattern: /(IPv4|IPv6)/,
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

Redis.propTypes = {
  form: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(Redis)
