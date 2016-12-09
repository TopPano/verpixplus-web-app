import merge from 'lodash/merge';
import assign from 'lodash/assign';
import union from 'lodash/union';
import {
  LOAD_USER_SUMMARY_REQUEST,
  LOAD_USER_SUMMARY_SUCCESS,
  LOAD_USER_SUMMARY_FAILURE,
  UPDATE_PROFILE_PICTURE_REQUEST,
  UPDATE_PROFILE_PICTURE_SUCCESS,
  UPDATE_PROFILE_PICTURE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  EDIT_AUTOBIOGRAPHY,
  CLEAR_ERR_MSG_CHANGE_PASSWORD
} from 'actions/user';
import {
  LOAD_USER_MEDIA_REQUEST,
  LOAD_USER_MEDIA_SUCCESS,
  LOAD_USER_MEDIA_FAILURE,
  CREATE_MEDIA_REQUEST,
  CREATE_MEDIA_PROGRESS,
  CREATE_MEDIA_SUCCESS,
  // TODO: Handle failure for media creation
  // CREATE_MEDIA_FAILURE,
  SHARE_FACEBOOK_REQUEST,
  SHARE_FACEBOOK_SUCCESS,
  SHARE_FACEBOOK_FAILURE,
  DELETE_MEDIA_REQUEST,
  DELETE_MEDIA_SUCCESS,
  DELETE_MEDIA_FAILURE
} from 'actions/media';
import { DEFAULT_PROFILE_PHOTO_URL } from 'constants/common';

const DEFAULT_STATE = {
  isFetching: false,
  // TODO: Add more targets for isProcessing
  isProcessing: {
    updateProfilePicture: false,
    updateProfile: false,
    changePassword: false,
    shareFacebook: false
  },
  userId: undefined,
  username: undefined,
  profilePhotoUrl: undefined,
  numOfMedia: 0,
  autobiography: undefined,
  // List for completed media
  media: {
    objs: {},
    ids: [],
    hasNext: false,
    lastMediaId: ''
  },
  // List for progressing media
  progressMedia: {
    objs: {},
    ids: []
  },
  // Error messages
  errMsgs: {
    changePassword: ''
  }
};

export default function workspace(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case LOAD_USER_SUMMARY_REQUEST:
    case LOAD_USER_MEDIA_REQUEST:
    case DELETE_MEDIA_REQUEST:
      return merge({}, state, {
        isFetching: true
      });
    case CREATE_MEDIA_REQUEST:
    {
      const { progressMediaId } = action.media;
      const newIds = union([progressMediaId], state.progressMedia.ids);

      return merge({}, state, {
        progressMedia: {
          objs: {
            [progressMediaId]: {
              progress: 0
            }
          },
          ids: newIds
        }
      });
    }
    case UPDATE_PROFILE_PICTURE_REQUEST:
      return merge({}, state, {
        isProcessing: {
          updateProfilePicture: true
        }
      });
    case UPDATE_PROFILE_REQUEST:
      return merge({}, state, {
        isProcessing: {
          updateProfile: true
        }
      });
    case CHANGE_PASSWORD_REQUEST:
      return merge({}, state, {
        isProcessing: {
          changePassword: true
        }
      });
    case SHARE_FACEBOOK_REQUEST:
      return merge({}, state, {
        isProcessing: {
          shareFacebook: true
        }
      });
    case CREATE_MEDIA_PROGRESS:
      return merge({}, state, {
        progressMedia: {
          objs: {
            [action.progressMediaId]: {
              progress: action.progress
            }
          }
        }
      })
    case LOAD_USER_SUMMARY_SUCCESS:
    {
      const { sid, username, profilePhotoUrl, media, autobiography } = action.response.profile;
      return merge({}, state, {
        isFetching: false,
        userId: sid,
        username,
        profilePhotoUrl: profilePhotoUrl ? profilePhotoUrl : DEFAULT_PROFILE_PHOTO_URL,
        numOfMedia: media,
        autobiography
      });
    }
    case LOAD_USER_MEDIA_SUCCESS:
    {
      let { entities: { media }, result: { result: { page, feed }, firstQuery } } = action.response;
      const hasNext = page.hasNextPage;
      const lastMediaId = page.end;

      let genNextState = undefined;
      if (firstQuery) {
        genNextState = assign; /* overwrite the previous state */
      } else {
        genNextState = merge;
        feed = state.media.ids.concat(feed);
      }
      return genNextState({}, state, {
        isFetching: false,
        media: {
          objs: media ? media : {},
          ids: feed,
          hasNext,
          lastMediaId
        }
      });
    }
    case CREATE_MEDIA_SUCCESS:
    {
      const {
        progressMediaId,
        result
      } = action.response;
      const mediaId = result.sid;
      const newState = merge({}, state, {
        media: {
          objs: {
            [mediaId]: result
          },
          ids: union([mediaId], state.media.ids)
        },
        numOfMedia: state.numOfMedia +1
      });

      // Delete from progress media list
      delete newState.progressMedia.objs[progressMediaId];
      newState.progressMedia.ids = newState.progressMedia.ids.filter((id) => { return id !== progressMediaId; });

      return newState;
    }
    case UPDATE_PROFILE_PICTURE_SUCCESS:
    {
      return merge({}, state, {
        profilePhotoUrl: action.response.profilePhotoUrl,
        isProcessing: {
          updateProfilePicture: false
        }
      });
    }
    case UPDATE_PROFILE_SUCCESS:
      return merge({}, state, {
        autobiography: action.response.autobiography,
        isProcessing: {
          updateProfile: false
        }
      });
    case DELETE_MEDIA_SUCCESS:
    {
      const { mediaId } = action.response;
      let newState = merge({}, state, {
        isFetching: false,
        numOfMedia: state.numOfMedia > 0 ? state.numOfMedia - 1 : 0
      });
      delete newState.media.objs[mediaId];
      newState.media.ids = newState.media.ids.filter((id) => { return id !== mediaId; });
      if (newState.media.lastMediaId === mediaId) {
        newState.media.lastMediaId = newState.media.ids.length > 0 ?
                                     newState.media.ids[newState.media.ids.length - 1] :
                                     '';
      }
      return newState;
    }
    case CHANGE_PASSWORD_SUCCESS:
      return merge({}, state, {
        isProcessing: {
          changePassword: false
        }
      });
    case SHARE_FACEBOOK_SUCCESS:
      return merge({}, state, {
        isProcessing: {
          shareFacebook: false
        }
      });
    case EDIT_AUTOBIOGRAPHY:
      return merge({}, state, {
        autobiography: action.autobiography
      })
    case LOAD_USER_SUMMARY_FAILURE:
    case LOAD_USER_MEDIA_FAILURE:
    case DELETE_MEDIA_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    case UPDATE_PROFILE_PICTURE_FAILURE:
      return merge({}, state, {
        isProcessing: {
          updateProfilePicture: false
        }
      });
    case UPDATE_PROFILE_FAILURE:
      return merge({}, state, {
        isProcessing: {
          updateProfile: false
        }
      });
    case CHANGE_PASSWORD_FAILURE:
      return merge({}, state, {
        errMsgs: {
          changePassword: action.err.message
        },
        isProcessing: {
          changePassword: false
        }
      });
    case SHARE_FACEBOOK_FAILURE:
      return merge({}, state, {
        isProcessing: {
          shareFacebook: false
        }
      });
    case CLEAR_ERR_MSG_CHANGE_PASSWORD:
      return merge({}, state, {
        errMsgs: {
          changePassword: ''
        }
      });
    default:
      return state;
  }
}
