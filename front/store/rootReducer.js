/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form';
// import { reducer as globalReducer } from 'containers/App/redux';


/**
 * Creates the main reducer with the dynamically injected ones
 */
export default combineReducers({
  // global: globalReducer,
  form: formReducer,
});
