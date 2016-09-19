import merge from 'lodash/merge';
import {
  INIT_UPLOAD,
  INIT_EDIT,
  CONVERT_REQUEST,
  CONVERT_PROGRESS,
  CONVERT_SUCCESS,
  CONVERT_FAILURE,
  EDIT_TITLE,
  EDIT_CAPTION,
  CREATE_MEDIA_REQUEST,
  CREATE_MEDIA_PROGRESS,
  CREATE_MEDIA_SUCCESS,
  CREATE_MEDIA_FAILURE
} from 'actions/editor';
import { MODE } from 'constants/editor';

const DEFAULT_STATE = {
  mediaId: '',
  mode: '',
  mediaType: '',
  isProcessing: false,
  title: '',
  caption: '',
  progress: 0,
  data: [],
  dataUrls: [],
  dimension: { width: 0, height: 0 },
  err: { message: '' }
};

export default function editor(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case INIT_UPLOAD:
      return merge({}, state, {
        mode: MODE.WAIT_FILE
      });
    case INIT_EDIT:
      return merge({}, state, {
        mediaId: action.mediaId,
        mode: MODE.EDIT
      });
    case EDIT_TITLE:
      return merge({}, state, {
        title: action.title
      });
    case EDIT_CAPTION:
      return merge({}, state, {
        caption: action.caption
      });
    case CONVERT_REQUEST:
    case CREATE_MEDIA_REQUEST:
      return merge({}, state, {
        isProcessing: true,
        progress: 0
      });
    case CONVERT_PROGRESS:
    case CREATE_MEDIA_PROGRESS:
      return merge({}, state, {
        progress: action.progress
      });
    case CONVERT_SUCCESS:
      return merge({}, state, {
        mode: MODE.CREATE,
        isProcessing: false,
        mediaType: action.mediaType,
        data: action.result.data,
        dataUrls: action.result.dataUrls,
        dimension: action.result.dimension
      });
    case CREATE_MEDIA_SUCCESS:
      return merge({}, state, {
        mediaId: action.response.result.mediaId,
        mode: MODE.EDIT,
        isProcessing: false
      });
    case CONVERT_FAILURE:
    case CREATE_MEDIA_FAILURE:
      return merge({}, state, {
        isProcessing: false,
        err: action.err
      });
    default:
      return state;
  }
}
