import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button } from 'antd'
import Progress from './components/Progress'
import Mongodb from './components/Mongodb'
import Redis from './components/Redis'
import Setting from './components/Setting'
import styles from './index.less'

const Install = ({
  install,
  dispatch,
}) => {
  const { step } = install

  function onOk (values) {
    switch (step) {
      case 0:
        dispatch({ type: 'install/database', payload: values })
        break
      case 1:
        dispatch({ type: 'install/redis', payload: values })
        break
      case 2:
        dispatch({ type: 'install/install', payload: values })
        break
      default:

    }
  }

  function handleOk () {
    window.location = `${window.location.origin}/login`
  }

  return (
    <div className={styles.body}>
      <Progress current={step} />
      {
        step === 0 && <Mongodb onOk={onOk} />
      }

      {
        step === 1 && <Redis onOk={onOk} />
      }

      {
        step === 2 && <Setting onOk={onOk} />
      }

      {
        step === 3 && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>安装成功!</h1>
          <Button style={{ marginTop: '50px' }} size="large" type="primary" onClick={handleOk}>登录后台</Button>
        </div>
      }
    </div>
  )
}

Install.propTypes = {
  install: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ install }) => ({ install }))(Install)
