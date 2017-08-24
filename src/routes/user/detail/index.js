import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const Detail = ({ userDetail }) => {
  const { data } = userDetail
  const content = []
  for (let key in data) {
    if ({}.hasOwnProperty.call(data, key)) {
      content.push(<div key={key} className={styles.item}>
        <div>{key}</div>
        <div>{
          (function () {
            if (typeof data[key] === 'object') {
              const child = []
              for (let k in data[key]) {
                if ({}.hasOwnProperty.call(data[key], k)) {
                  child.push(<div key={k} className={styles.item}>
                    <div>{k}</div>
                    <div>{String(data[key][k])}</div>
                  </div>)
                }
              }
              return child
            }
            return String(data[key])
          }())
        }</div>
      </div>)
    }
  }
  return (<div className="content-inner">
    <div className={styles.content}>
      {content}
    </div>
  </div>)
}

Detail.propTypes = {
  userDetail: PropTypes.object,
}

export default connect(({ userDetail }) => ({ userDetail }))(Detail)
