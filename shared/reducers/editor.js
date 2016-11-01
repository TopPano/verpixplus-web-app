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
  CHANGE_EDIT_TARGET,
  TRIM,
  EDIT_TITLE,
  EDIT_CAPTION,
  ADJUST_FILTERS,
  APPLY_FILTERS_REQUEST,
  APPLY_FILTERS_PROGRESS,
  APPLY_FILTERS_SUCCESS,
  APPLY_FILTERS_FAILURE
} from 'actions/editor';
import {
  GET_MEDIA_REQUEST,
  GET_MEDIA_SUCCESS,
  GET_MEDIA_FAILURE,
  UPDATE_MEDIA_REQUEST,
  UPDATE_MEDIA_FAILURE
} from 'actions/media';
import {
  MODE,
  PLAYER_MODE,
  EDIT_TARGET,
  FRAMES_LIMIT
} from 'constants/editor';
import { genUUID } from 'lib/utils';

const DEFAULT_STATE = {
  mediaId: '',
  storageId: '',
  mode: '',
  mediaType: '',
  isProcessing: false,
  title: '',
  caption: '',
  progress: 0,
  appliedData: [],
  dimension: { width: 100, height: 100 },
  playerMode: PLAYER_MODE.PLAY,
  autoplay: true,
  editTarget: '',
  lower: 0,
  upper: 0,
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
    {
      const storageId = genUUID();

      return merge({}, DEFAULT_STATE, {
        storageId,
        mode: MODE.WAIT_FILE
      });
    }
    case INIT_EDIT:
      return merge({}, DEFAULT_STATE, {
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
    case CHANGE_EDIT_TARGET:
      return merge({}, state, {
        editTarget: action.editTarget
      })
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
    case UPDATE_MEDIA_REQUEST:
    case APPLY_FILTERS_REQUEST:
      return merge({}, state, {
        isProcessing: true,
        progress: 0
      });
    case CONVERT_PROGRESS:
      return merge({}, state, {
        progress: action.progress
      });
    case APPLY_FILTERS_PROGRESS:
    {
      delete state.appliedData[action.idx];
      state.appliedData[action.idx] = action.appliedImage;
      return state;
    }
    case CONVERT_SUCCESS:
    {
      const dataLength = action.result.data.length;

      return merge({}, state, {
        mode: MODE.CREATE,
        isProcessing: false,
        mediaType: action.mediaType,
        appliedData: action.result.data,
        dimension: action.result.dimension,
        playerMode: PLAYER_MODE.PLAY,
        editTarget: EDIT_TARGET.FRAMES,
        lower: 0,
        upper: dataLength < FRAMES_LIMIT ? dataLength : FRAMES_LIMIT
      });
    }
    case GET_MEDIA_SUCCESS:
      const {
        mediaType,
        title,
        caption,
        imgsData,
        imgUrls,
        dimension
      } = action.response.result;

      return merge({}, state, {
        isProcessing: false,
        mediaType,
        title,
        caption,
        appliedData: imgsData,
        dimension,
        lower: 0,
        upper: imgUrls.length
      });
    case APPLY_FILTERS_SUCCESS:
      return merge({}, state, {
        isProcessing: false,
        filters: {
          isDirty: false
        }
      });
    case CONVERT_FAILURE:
    case GET_MEDIA_FAILURE:
    case UPDATE_MEDIA_FAILURE:
    case APPLY_FILTERS_FAILURE:
      return merge({}, state, {
        isProcessing: false,
        err: action.err
      });
    default:
      return state;
  }
}
