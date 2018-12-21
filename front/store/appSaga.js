/* ------------- Types ------------- */

import Actions, { Types } from './appRedux'

/**
 * Project start up task
 */
export function* startup(action) {
  if (auth.loggedIn()) yield put(Actions.queryUserRequest())
}
