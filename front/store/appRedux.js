import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startup: null,

  logoutRequest: null,
  logoutSuccess: null,
  logoutFailure: null,

  queryUserRequest: null,
  queryUserSuccess: ['data'],
  queryUserFailure: ['error'],
})

export { Types }

export default Creators

/* ------------- Initial State ------------- */

export const initialState = fromJS({
  currentUser: {},
})

/* ------------- Reducers ------------- */

export const logoutSuccess = state => state.set('currentUser', {}).set('inLogin', false)

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(initialState, {
  [Types.LOGOUT_SUCCESS]: logoutSuccess,
})
