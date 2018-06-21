import React from 'react'
import PropTypes from 'prop-types'
import { Steps } from 'antd'
import styles from '../index.less'

const Step = Steps.Step

const Progress = ({ current = 0 }) => (
  <div style={{ marginBottom: 30 }}>
    <Steps current={current}>
      <Step title="mongodb" />
      <Step title="redis" />
      <Step title="配置" />
      <Step title="成功" />
    </Steps>
    <h2 className={styles.title}>安装</h2>
  </div>
)

Progress.propTypes = {
  current: PropTypes.number,
}

export default Progress
