import React from 'react'
import { Card, Button } from 'antd'
import styles from './Item.less'

const ButtonGroup = Button.Group

const Item = () => (
  <Card title="title" extra={<ButtonGroup>
    <Button>卸载</Button>
    <Button type="primary">启用</Button>
  </ButtonGroup>}
  >
    <div style={{ padding: '10px 16px' }}>
      <img className={styles.cover} alt="cover" src="" />
    </div>
    <div className="custom-card">
      <h3>Europe Street beat</h3>
      <p>www.instagram.com</p>
    </div>
  </Card>
)

export default Item
