import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Progress from './Progress'
import Mongodb from './Mongodb'
import Redis from './Redis'
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
      default:

    }
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
    </div>
  )
}

Install.propTypes = {
  install: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ install }) => ({ install }))(Install)
