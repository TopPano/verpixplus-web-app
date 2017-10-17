import isString from 'lodash/isString';

import { NOTIFICATION_TYPES } from 'constants/notifications';
import { genUUID } from 'lib/utils';

export const PUSH_NOTIFICATION = 'PUSH_NOTIFICATION';
export const UPDATE_PROGRESS_NOTIFICATION = 'UPDATE_PROGRESS_NOTIFICATION';
export const POP_NOTIFICATION = 'POP_NOTIFICATION';

export function pushNotification(notification, id) {
  return (dispatch) => {
    dispatch({
      type: PUSH_NOTIFICATION,
      id: id ? id : genUUID(),
      notification: !isString(notification) ? notification : {
        type: NOTIFICATION_TYPES.INFO,
        message: notification
      }
    });
  };
}

export function updateProgressNotification(id, progress) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_PROGRESS_NOTIFICATION,
      id,
      progress
    });
  };
}

export function popNotification(id) {
  return (dispatch) => {
    dispatch({
      type: POP_NOTIFICATION,
      id
    });
  };
}
