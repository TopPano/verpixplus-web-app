import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import user from './user';
import post from './post';
import person from './person';
import newsFeed from './newsFeed';
import explorer from './explorer';
import like from './like';
import editor from './editor';

const rootReducers = combineReducers({
  user,
  post,
  person,
  newsFeed,
  explorer,
  like,
  editor,
  routing
})

export default rootReducers
