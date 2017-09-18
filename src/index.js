import 'babel-polyfill'
import dva from 'dva'
import createLoading from 'dva-loading'
import { useRouterHistory } from 'dva/router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { message } from 'antd'
import { config } from './utils'
import './index.html'

const { routePrefix, failToken } = config

const ERROR_DURATION = 2

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  // initialState: {},
  history: useRouterHistory(createBrowserHistory)({ basename: routePrefix }),
  onError (error) {
    if (error.code === 'TK99') {
      failToken()
    } else {
      message.error(error.msg || error.message, ERROR_DURATION)
    }
  },
})

// 2. Plugins
// app.use({})

// 3. Model
app.model(require('./models/app'))

// 4. Router
app.router(require('./router'))

// 5. Start
app.start('#root')
