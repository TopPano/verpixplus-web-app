import merge from 'lodash/merge';
import assign from 'lodash/assign';
import {
  LOAD_USER_SUMMARY_REQUEST,
  LOAD_USER_SUMMARY_SUCCESS,
  LOAD_USER_SUMMARY_FAILURE,
  UPDATE_PROFILE_PICTURE_REQUEST,
  UPDATE_PROFILE_PICTURE_SUCCESS,
  UPDATE_PROFILE_PICTURE_FAILURE
} from 'actions/user';
import {
  LOAD_USER_MEDIA_REQUEST,
  LOAD_USER_MEDIA_SUCCESS,
  LOAD_USER_MEDIA_FAILURE,
  CREATE_VIDEO_REQUEST,
  CREATE_VIDEO_SUCCESS,
  CREATE_VIDEO_FAILURE,
  DELETE_MEDIA_REQUEST,
  DELETE_MEDIA_SUCCESS,
  DELETE_MEDIA_FAILURE
} from 'actions/media';
import { DEFAULT_PROFILE_PHOTO_URL } from 'constants/common';

const DEFAULT_STATE = {
  isFetching: false,
  // TODO: Add more targets for isProcessing
  isProcessing: {
    updateProfilePicture: false
  },
  userId: undefined,
  username: undefined,
  profilePhotoUrl: undefined,
  numOfMedia: 0,
  autobiography: undefined,
  media: {
    objs: {},
    ids: [],
    hasNext: false,
    lastMediaId: ''
  }
};

export default function workspace(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case LOAD_USER_SUMMARY_REQUEST:
    case LOAD_USER_MEDIA_REQUEST:
    case DELETE_MEDIA_REQUEST:
    case CREATE_VIDEO_REQUEST:
      return merge({}, state, {
        isFetching: true
      });
    case UPDATE_PROFILE_PICTURE_REQUEST:
      return merge({}, state, {
        isProcessing: {
          updateProfilePicture: true
        }
      });
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
    case CREATE_VIDEO_SUCCESS:
    {
      const { mediaId } = action.response;
      return merge({}, state, {
        isFetching: false,
        media: {
          objs: {
            [mediaId]: {
              isVideoCreated: true
            }
          }
        }
      });
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
    case LOAD_USER_SUMMARY_FAILURE:
    case LOAD_USER_MEDIA_FAILURE:
    case DELETE_MEDIA_FAILURE:
    case CREATE_VIDEO_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    case UPDATE_PROFILE_PICTURE_FAILURE:
      return merge({}, state, {
        isProcessing: {
          updateProfilePicture: false
        }
      });
    default:
      return state;
  }
}
