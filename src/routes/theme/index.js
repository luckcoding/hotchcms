import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Upload, Button, Icon, Row, Col, message } from 'antd'
import Item from './Item'
import { config } from '../../utils'

const { getToken, failToken, api } = config

const Theme = ({ theme, dispatch }) => {
  const { themeList } = theme
  const uploadProps = {
    name: 'file',
    showUploadList: false,
    action: api.theme.replace('/:_id', ''),
    headers: {
      authorization: getToken(),
    },
    onChange (info) {
      const { status, response } = info.file
      if (status === 'done') {
        if (response.code === '0000') {
          message.success('安装成功')
          dispatch({ type: 'theme/query' })
        } else {
          message.error(response.message)
          if (response.code === 'TK99') {
            setTimeout(() => failToken(), 500)
          }
        }
      } else if (status === 'error') {
        message.error('安装失败')
      }
    },
  }

  const onEnable = ({ using, _id }) => {
    if (!using) {
      dispatch({
        type: 'theme/enable',
        payload: { _id },
      })
    }
  }

  const unInstall = (item) => {
    if (!item.using) {
      dispatch({
        type: 'theme/uninstall',
      })
    }
  }

  return (
    <div>
      <Upload {...uploadProps}>
        <Button type="primary">
          <Icon type="upload" /> 安装主题
        </Button>
      </Upload>
      <Row style={{ marginTop: '30px' }} type="flex" align="middle" gutter={20}>
        {themeList.map((item, key) => (
          <Col key={key} lg={8} sm={12} xs={24}>
            <Item info={item} onEnable={onEnable} unInstall={unInstall} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

Theme.propTypes = {
  theme: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ theme }) => ({ theme }))(Theme)
