import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './routes/app'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = ({ history, app }) => {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/dashboard'))
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },

      childRoutes: [
        {
          path: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        },

        {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/login'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        },

        {
          path: 'admin-user',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/adminUser'))
              cb(null, require('./routes/adminUser/'))
            }, 'admin-user')
          },
        },

        {
          path: 'admin-user/:id',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/adminUser/detail'))
              cb(null, require('./routes/adminUser/detail/'))
            }, 'admin-user-detail')
          },
        },

        {
          path: 'admin-group',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/adminGroup'))
              cb(null, require('./routes/adminGroup/'))
            }, 'admin-group')
          },
        },

        {
          path: 'setting',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting'))
              cb(null, require('./routes/setting/'))
            }, 'setting')
          },
        },

        {
          path: 'theme',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/theme'))
              cb(null, require('./routes/theme/'))
            }, 'theme')
          },
        },

        {
          path: 'category',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/category'))
              cb(null, require('./routes/category/'))
            }, 'category')
          },
        },

        {
          path: 'content',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/content'))
              cb(null, require('./routes/content/'))
            }, 'content')
          },
        },

        {
          path: 'install',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/install'))
              cb(null, require('./routes/install/'))
            }, 'install')
          },
        },

      ],
    },
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
