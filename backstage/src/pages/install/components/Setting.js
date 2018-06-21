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
        label="管理员邮箱"
        hasFeedback
      >
        {getFieldDecorator('email', {
          rules: [{
            type: 'email',
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
        label="管理员密码"
        hasFeedback
      >
        {getFieldDecorator('password', {
          rules: [{
            required: true,
          }],
        })(
          <Input type="password" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="网站标题"
        hasFeedback
      >
        {getFieldDecorator('title', {
          initialValue: 'hotchcms',
          rules: [{
            required: true,
          }],
        })(
          <Input />
        )}
      </FormItem>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" onClick={handleOk}>安装</Button>
      </div>
    </Form>
  )
}

Redis.propTypes = {
  form: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(Redis)
