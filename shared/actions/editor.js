import { push } from 'react-router-redux';
import startsWith from 'lodash/startsWith';

export const INIT_UPLOAD = 'INIT_UPLOAD';
export const INIT_EDIT = 'INIT_EDIT';

// Initialize editor state
export function initEditor({ params = {}, location = {} }) {
  return (dispatch) => {
    if (startsWith(location.pathname, '/upload')) {
      // Upload
      dispatch({
        type: INIT_UPLOAD
      });
    } else if (startsWith(location.pathname, '/edit')){
      // Edit
      // TODO: Handle Edit mode
      dispatch({
        type: INIT_EDIT,
        postId: params.postId
      });
    } else {
      // Other cases, redirect to home page
      dispatch(push('/'));
    }
  };
}
