import { message } from 'antd'
import { auth } from 'utils'

const ERROR_DURATION = 2

export default {
  onError (e) {
    if (e.code === 'TK99') {
      auth.jump()
    } else {
      message.error(e.msg || e.message, ERROR_DURATION)
    }
  },
}
