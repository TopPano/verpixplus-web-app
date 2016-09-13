import merge from 'lodash/merge';
import {
  INIT_UPLOAD,
  INIT_EDIT
} from 'actions/editor';
import { MODE } from 'constants/editor';

const DEFAULT_STATE = {
  postId: '',
  mode: '',
  isProcessing: false,
  progress: 0
};

export default function editor(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case INIT_UPLOAD:
      return merge({}, state, {
        mode: MODE.WAIT_FILE
      });
    case INIT_EDIT:
      return merge({}, state, {
        postId: action.postId,
        mode: MODE.EDIT
      });
    default:
      return state;
  }
}
