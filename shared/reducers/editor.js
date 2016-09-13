import merge from 'lodash/merge';
import {
  INIT_UPLOAD,
  INIT_EDIT,
  CONVERT_REQUEST,
  CONVERT_PROGRESS,
  CONVERT_SUCCESS,
  CONVERT_FAILURE
} from 'actions/editor';
import { MODE } from 'constants/editor';

const DEFAULT_STATE = {
  postId: '',
  mode: '',
  isProcessing: false,
  progress: 0,
  result: undefined,
  errMsg: ''
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
    case CONVERT_REQUEST:
      return merge({}, state, {
        isProcessing: true,
        progress: 0
      });
    case CONVERT_PROGRESS:
      return merge({}, state, {
        progress: action.progress
      });
    case CONVERT_SUCCESS:
      return merge({}, state, {
        mode: MODE.CREATE,
        isProcessing: false,
        result: action.result
      });
    case CONVERT_FAILURE:
      return merge({}, state, {
        isProcessing: false
      });
    default:
      return state;
  }
}
