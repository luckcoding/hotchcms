import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { keyBy } from 'lodash'
import { Form, Input, InputNumber, Modal, Select } from 'antd'
import { withI18n } from '@lingui/react'

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
  // 解析权限对应传值
  decode = authorities => {
    let output = []
    const authPrefix = keyBy(this.props.authoritiesOwned, 'prefix')
    authorities.forEach(function(item) {
      if (authPrefix[item] && authPrefix[item].value) {
        output.push(authPrefix[item].value)
      }
    })
    return output
  }

  handleOk = () => {
    const { item = {}, onOk, form } = this.props
    const { validateFields, getFieldsValue } = form

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }

      data.authorities = this.decode(data.authorities)

      onOk(data)
    })
  }

  render() {
    const {
      item = {},
      onOk,
      form,
      i18n,
      authoritiesOwned = [],
      ...modalProps
    } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label={i18n.t`Name`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Description`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Gradation`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('gradation', {
              initialValue: item.gradation,
              rules: [
                {
                  required: true,
                },
              ],
            })(<InputNumber min={0} max={100} />)}
          </FormItem>
          <FormItem label={i18n.t`Authority`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('authorities', {
              initialValue: Array.isArray(item.authority)
                ? item.authority.map(_ => _.prefix)
                : [],
            })(
              <Select mode="multiple">
                {authoritiesOwned.map((item, key) => (
                  <Option key={key} value={item.prefix}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  authoritiesOwned: PropTypes.array.isRequired,
}

export default UserModal
