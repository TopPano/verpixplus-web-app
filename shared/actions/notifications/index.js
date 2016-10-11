export const PUSH_NOTIFICATION = 'PUSH_NOTIFICATION';
export const POP_NOTIFICATION = 'POP_NOTIFICATION';

export function pushNotification(notification) {
  return (dispatch) => {
    dispatch({
      type: PUSH_NOTIFICATION,
      notification
    });
  };
}

export function popNotification() {
  return (dispatch) => {
    dispatch({
      type: POP_NOTIFICATION
    });
  };
}
