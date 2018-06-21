import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button } from 'antd'
import styles from './Item.less'

import { config } from 'utils'

const ButtonGroup = Button.Group

const Item = ({ info = {}, onEnable, unInstall }) => (
  <Card title={info.name} extra={<ButtonGroup>
    {
      info.using && <Button onClick={() => unInstall(info)}>卸载</Button>
    }
    <Button type={info.using ? 'danger' : 'primary'} onClick={() => onEnable(info)}>
      {info.using ? '停用' : '启用'}
    </Button>
  </ButtonGroup>}
  >
    <div style={{ padding: '10px 16px' }}>
      <img className={styles.cover} alt="cover" src={info.cover || config.cover} />
    </div>
    <div className="custom-card">
      <h3>{info.description}</h3>
      <p>{info.author}</p>
    </div>
  </Card>
)

Item.propTypes = {
  info: PropTypes.object,
  onEnable: PropTypes.func,
  unInstall: PropTypes.func,
}

export default Item
