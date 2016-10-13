import merge from 'lodash/merge';
import {
  INIT_UPLOAD,
  INIT_EDIT,
  CONVERT_REQUEST,
  CONVERT_PROGRESS,
  CONVERT_SUCCESS,
  CONVERT_FAILURE,
  PLAYER_PLAY,
  PLAYER_PAUSE,
  PLAYER_SET_AUTOPLAY,
  TRIM,
  EDIT_TITLE,
  EDIT_CAPTION,
  ADJUST_FILTERS,
  APPLY_FILTERS_REQUEST,
  APPLY_FILTERS_SUCCESS,
  APPLY_FILTERS_FAILURE
} from 'actions/editor';
import {
  GET_MEDIA_REQUEST,
  GET_MEDIA_SUCCESS,
  GET_MEDIA_FAILURE,
  CREATE_MEDIA_REQUEST,
  CREATE_MEDIA_SUCCESS,
  CREATE_MEDIA_FAILURE
} from 'actions/media';
import {
  MODE,
  PLAYER_MODE,
  FRAMES_LIMIT
} from 'constants/editor';

const DEFAULT_STATE = {
  mediaId: '',
  mode: '',
  mediaType: '',
  isProcessing: false,
  title: '',
  caption: '',
  progress: 0,
  data: [],
  appliedData: [],
  dataUrls: [],
  dimension: { width: 0, height: 0 },
  playerMode: PLAYER_MODE.PAUSE,
  autoplay: true,
  lower: 0,
  upper: FRAMES_LIMIT,
  filters: {
    preset: 'normal',
    adjusts: {},
    isDirty: false
  },
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
    case PLAYER_PLAY:
      return merge({}, state, {
        playerMode: PLAYER_MODE.PLAY
      });
    case PLAYER_PAUSE:
      return merge({}, state, {
        playerMode: PLAYER_MODE.PAUSE
      });
    case PLAYER_SET_AUTOPLAY:
      return merge({}, state, {
        autoplay: action.autoplay
      });
    case TRIM:
      return merge({}, state, {
        lower: action.lower,
        upper: action.upper
      });
    case EDIT_TITLE:
      return merge({}, state, {
        title: action.title
      });
    case EDIT_CAPTION:
      return merge({}, state, {
        caption: action.caption
      });
    case ADJUST_FILTERS:
      return merge({}, state, {
        filters: {
          preset: action.filters.preset,
          adjusts: action.filters.adjusts,
          isDirty: true
        }
      });
    case CONVERT_REQUEST:
    case GET_MEDIA_REQUEST:
    case CREATE_MEDIA_REQUEST:
    case APPLY_FILTERS_REQUEST:
      return merge({}, state, {
        isProcessing: true,
        progress: 0
      });
    case CONVERT_PROGRESS:
      return merge({}, state, {
        progress: action.progress
      });
    case CONVERT_SUCCESS:
      const dataLength = action.result.dataUrls.length;

      return merge({}, state, {
        mode: MODE.CREATE,
        isProcessing: false,
        mediaType: action.mediaType,
        data: action.result.data,
        appliedData: action.result.data,
        dataUrls: action.result.dataUrls,
        dimension: action.result.dimension,
        playerMode: PLAYER_MODE.PLAY,
        lower: 0,
        upper: dataLength < FRAMES_LIMIT ? dataLength : FRAMES_LIMIT
      });
    case GET_MEDIA_SUCCESS:
      // TODO: fill title
      const {
        mediaType,
        // title,
        caption,
        imgsData,
        imgUrls,
        dimension
      } = action.response.result;

      return merge({}, state, {
        isProcessing: false,
        mediaType,
        // title,
        caption,
        data: imgsData,
        appliedData: imgsData,
        dataUrls: imgUrls,
        dimension
      });
    case CREATE_MEDIA_SUCCESS:
      return merge({}, state, {
        mediaId: action.response.result.mediaId,
        isProcessing: false
      });
    case APPLY_FILTERS_SUCCESS:
      return merge({}, state, {
        isProcessing: false,
        appliedData: action.result.appliedData,
        dataUrls: action.result.dataUrls,
        filters: {
          isDirty: false
        }
      });
    case CONVERT_FAILURE:
    case GET_MEDIA_FAILURE:
    case CREATE_MEDIA_FAILURE:
    case APPLY_FILTERS_FAILURE:
      return merge({}, state, {
        isProcessing: false,
        err: action.err
      });
    default:
      return state;
  }
}
