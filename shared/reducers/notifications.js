import filter from 'lodash/filter';
import assign from 'lodash/assign';
import merge from 'lodash/merge';
import union from 'lodash/union';
import omit from 'lodash/omit';

import {
  PUSH_NOTIFICATION,
  UPDATE_PROGRESS_NOTIFICATION,
  POP_NOTIFICATION
} from 'actions/notifications';

const DEFAULT_STATE = {
  ids: [],
  objs: {}
};

export default function notifications(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case PUSH_NOTIFICATION:
      return merge({}, state, {
        ids: union([action.id], state.ids),
        objs: {
          [action.id]: action.notification
        }
      });
    case UPDATE_PROGRESS_NOTIFICATION:
    {
      return merge({}, state, {
        objs: {
          [action.id]: {
            progress: action.progress
          }
        }
      });
    }
    case POP_NOTIFICATION:
      return assign({}, state, {
        ids: filter(state.ids, id => id !== action.id),
        objs: omit(state.objs, action.id)
      });
    default:
      return state;
  }
}
