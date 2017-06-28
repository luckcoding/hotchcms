import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Row, Col, Icon, Input, Button, Checkbox } from 'antd'
import { config } from '../../utils'
import styles from './index.less'

const FormItem = Form.Item

const Login = ({
  login,
  dispatch,
  form: {
    getFieldDecorator, // 双向绑定
    validateFieldsAndScroll, // 校验不通过的菜单域不在可见范围内，则自动滚动进可见范围
  },
}) => {
  const { loginLoading, captcha } = login

  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) return null
      return dispatch({ type: 'login/login', payload: values })
    })
  }

  function handleCaptcha () {
    dispatch({ type: 'login/captcha' })
  }

  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('email', {
            rules: [{ required: true, type: 'email', message: '请输入您的账号!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入您的密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          <Row>
            <Col span={16}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请输入验证码!' }],
              })(
                <Input type="text" placeholder="验证码" />
              )}
            </Col>
            <div style={{ textAlign: 'center' }}>
              <img className={styles.captcha} onClick={handleCaptcha} src={captcha} alt="验证码" />
            </div>
          </Row>
        </FormItem>
        <FormItem>
          {getFieldDecorator('autoSignIn', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住账户</Checkbox>
          )}
          <a href="">忘记密码?</a>
          <Button type="primary" onClick={handleOk} loading={loginLoading}>
            登录
          </Button>
        </FormItem>
      </form>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ login }) => ({ login }))(Form.create()(Login))
