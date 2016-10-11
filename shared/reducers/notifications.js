import clone from 'lodash/clone';
import {
  PUSH_NOTIFICATION,
  POP_NOTIFICATION
} from 'actions/notifications';

const DEFAULT_STATE = [];

export default function notifications(state = DEFAULT_STATE, action) {
  const newState = clone(state);

  switch (action.type) {
    case PUSH_NOTIFICATION:
      newState.push(action.notification);
      break;
    case POP_NOTIFICATION:
      if (newState.length > 0) {
        newState.shift();
      }
      break;
  }

  return newState;
}
