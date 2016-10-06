import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import user from './user';
import workspace from './workspace';
import editor from './editor';

const rootReducers = combineReducers({
  user,
  workspace,
  editor,
  routing
})

export default rootReducers
