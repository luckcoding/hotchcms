import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './routes/app'
import { routePrefix } from './utils/config';

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}


const Routers = ({ history, app }) => {
  const routes = [
    {
      path: routePrefix,
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/dashboard'))
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },

      childRoutes: [
        {
          path: `${routePrefix}/dashboard`,
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        },

        {
          path: `${routePrefix}/login`,
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/login'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        },

        {
          path: `${routePrefix}/admin-user`,
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/adminUser'))
              cb(null, require('./routes/adminUser/'))
            }, 'admin-user')
          },
        },

        {
          path: `${routePrefix}/admin-user/:id`,
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/adminUser/detail'))
              cb(null, require('./routes/adminUser/detail/'))
            }, 'admin-user-detail')
          },
        },

        {
          path: `${routePrefix}/admin-group`,
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/adminGroup'))
              cb(null, require('./routes/adminGroup/'))
            }, 'admin-group')
          },
        },

        {
          path: `${routePrefix}/setting`,
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/setting'))
              cb(null, require('./routes/setting/'))
            }, 'setting')
          },
        },

        {
          path: `${routePrefix}/category`,
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/category'))
              cb(null, require('./routes/category/'))
            }, 'category')
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
