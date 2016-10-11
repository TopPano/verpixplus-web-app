import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import user from './user';
import workspace from './workspace';
import editor from './editor';
import notifications from './notifications';

const rootReducers = combineReducers({
  user,
  workspace,
  editor,
  notifications,
  routing
})

export default rootReducers
