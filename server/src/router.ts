import Base from './controllers/base'
import Article from './controllers/article'

import { TRouter } from './utils/decorator'

/**
 * Base
 * ----------------------------------
 */
const router = new TRouter()
router
  .controllers([ Base ])
  .get('/', ctx => { ctx.body = 'Bluebook Services' })


// /**
//  * V1
//  * ----------------------------------
//  */
// const routerV1 = new TRouter({ prefix: '/v1' })
// routerV1
//   .controllers([
//     User,
//     Oauth,
//     Product,
//     ProductApply,
//     EvaluationShort,
//     ProductCategory
//   ])
//   .get('/', ctx => { ctx.body = 'API V1' })

/**
 * Admin
 * ----------------------------------
 */
const routerAdmin = new TRouter({ prefix: '/admin' })
routerAdmin
  .controllers([
    Article,
  ])
  .get('/', ctx => { ctx.body = 'API ADMIN' })

export default {
  base: router.routes(),
  // v1: routerV1.routes(),
  admin: routerAdmin.routes(),
}