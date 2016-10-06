import merge from 'lodash/merge';
import assign from 'lodash/assign';
import {
  LOAD_USER_SUMMARY_REQUEST,
  LOAD_USER_SUMMARY_SUCCESS,
  LOAD_USER_SUMMARY_FAILURE
} from 'actions/user';
import {
  LOAD_USER_MEDIA_REQUEST,
  LOAD_USER_MEDIA_SUCCESS,
  LOAD_USER_MEDIA_FAILURE,
  DELETE_MEDIA_REQUEST,
  DELETE_MEDIA_SUCCESS,
  DELETE_MEDIA_FAILURE
} from 'actions/media';
import { DEFAULT_PROFILE_PHOTO_URL } from 'constants/common';

const DEFAULT_STATE = {
  isFetching: false,
  userId: undefined,
  username: undefined,
  profilePhotoUrl: undefined,
  numOfMedia: 0,
  autobiography: undefined,
  media: {
    objs: {},
    ids: [],
    hasNext: true,
    lastMediaId: ''
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
      let hasNext = page.hasNextPage;
      let lastMediaId = page.end;

      let genNextState = undefined;
      if(firstQuery) {
        genNextState = assign; /* overwrite the previous state */
      } else {
        genNextState = merge;
        feed = state.posts.feedIds.concat(feed);
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
    case DELETE_MEDIA_SUCCESS:
    {
      const { mediaId } = action.response;
      let newState = merge({}, state, { isFetching: false, numOfMedia: state.numOfMedia - 1 });
      delete newState.media.objs[mediaId];
      newState.media.ids = newState.media.ids.filter((id) => { return id !== mediaId; });
      if (newState.media.lastMediaId === mediaId) {
        newState.media.lastMediaId = newState.media.ids[newState.media.ids.length - 1];
      }
      return newState;
    }
    case LOAD_USER_SUMMARY_FAILURE:
    case LOAD_USER_MEDIA_FAILURE:
    case DELETE_MEDIA_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
