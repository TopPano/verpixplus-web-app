import merge from 'lodash/merge';
import assign from 'lodash/assign';
import cookie from 'cookie';
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
  REGISTER_USER_REQUEST,
  REGISTER_USER_FAILURE,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  FACEBOOK_TOKEN_LOGIN_SUCCESS,
  CLEAR_USER_ERR_MSG,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  LOGOUT_USER_REQUEST,
  LOGOUT_USER_SUCCESS,
  EDIT_AUTOBIOGRAPHY,
  CLEAR_ERR_MSG_CHANGE_PASSWORD
} from '../actions/user';
import {
  CREATE_MEDIA_SUCCESS,
  DELETE_MEDIA_SUCCESS
} from 'actions/media';
import { DEFAULT_PROFILE_PHOTO_URL } from 'constants/common';

const DEFAULT_STATE = {
  isFetching: false,
  isProcessing: {
    loadUserSummary: false,
    updateProfilePhoto: false,
    updateProfile: false,
    changePassword: false
  },
  isAuthenticated: process.env.BROWSER ? Boolean(cookie.parse(document.cookie).accessToken) : false,
  userId: undefined,
  username: undefined,
  profilePhotoUrl: undefined,
  email: undefined,
  autobiography: undefined,
  created: undefined,
  numOfMedia: 0,
  errMsg: '',
  errMsgs: {
    changePassword: ''
  }
};

function updateStateForLoginSuccess(
  state,
  accessToken,
  userId,
  username,
  profilePhotoUrl,
  email,
  autobiography,
  created
) {
  const _profilePhotoUrl = profilePhotoUrl ? profilePhotoUrl : DEFAULT_PROFILE_PHOTO_URL;

  // XXX: Though Reducer should be pure without any side effect, however, we need to make a copy of the
  //      user state in cookie in order for server to restore from it, so centralize the code here would
  //      be clean.
  //      Move these code to action creator (loginUser) if it has any side effect.
  document.cookie = cookie.serialize('accessToken', accessToken, { path: '/', maxAge: 900000 });
  document.cookie = cookie.serialize('userId', userId, { path: '/', maxAge: 900000 });
  document.cookie = cookie.serialize('username', username, { path: '/', maxAge: 900000 });
  document.cookie = cookie.serialize('profilePhotoUrl', _profilePhotoUrl, { path: '/', maxAge: 900000 });
  document.cookie = cookie.serialize('email', email, { path: '/', maxAge: 900000 });
  document.cookie = cookie.serialize('created', created, { path: '/', maxAge: 900000 });
  return assign({}, state, {
    isFetching: false,
    isAuthenticated: true,
    userId,
    username,
    accessToken,
    profilePhotoUrl: _profilePhotoUrl,
    autobiography,
    email,
    created,
    errMsg: ''
  });
}

export default function user(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case LOAD_USER_SUMMARY_REQUEST:
      return merge({}, state, {
        isProcessing: {
          loadUserSummary: true
        }
      });
    case UPDATE_PROFILE_PICTURE_REQUEST:
      return merge({}, state, {
        isProcessing: {
          updateProfilePhoto: true
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
    case REGISTER_USER_REQUEST:
    case LOGIN_USER_REQUEST:
    case LOGOUT_USER_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return merge({}, state, {
        isFetching: true,
        isAuthenticated: false
      });
    case LOAD_USER_SUMMARY_SUCCESS:
    {
      const {
        sid,
        username,
        profilePhotoUrl,
        media,
        autobiography
      } = action.response.profile;

      return merge({}, state, {
        isProcessing: {
          loadUserSummary: false
        },
        userId: sid,
        username,
        profilePhotoUrl: profilePhotoUrl ? profilePhotoUrl : DEFAULT_PROFILE_PHOTO_URL,
        autobiography,
        numOfMedia: media
      });
    }
    case UPDATE_PROFILE_PICTURE_SUCCESS:
      return merge({}, state, {
        profilePhotoUrl: action.response.profilePhotoUrl,
        isProcessing: {
          updateProfilePhoto: false
        }
      });
    case UPDATE_PROFILE_SUCCESS:
      return merge({}, state, {
        autobiography: action.response.autobiography,
        isProcessing: {
          updateProfile: false
        }
      });
    case CHANGE_PASSWORD_SUCCESS:
      return merge({}, state, {
        isProcessing: {
          changePassword: false
        }
      });
    case LOGIN_USER_SUCCESS: {
      const {
        id,
        userId,
        created,
        user: {
          username,
          profilePhotoUrl,
          email,
          autobiography
        }
      } = action.response;
      return updateStateForLoginSuccess(state, id, userId, username, profilePhotoUrl, email, autobiography, created);
    }
    case CREATE_MEDIA_SUCCESS:
      return merge({}, state, {
        numOfMedia: state.numOfMedia + 1
      })
    case DELETE_MEDIA_SUCCESS:
      return merge({}, state, {
        numOfMedia: state.numOfMedia > 0 ? state.numOfMedia - 1 : 0
      })
    case FACEBOOK_TOKEN_LOGIN_SUCCESS: {
      const {
        token: { id, userId, created },
        user: { profilePhotoUrl, email },
        identity: { profile: { displayName } }
      } = action.response.auth;
      return updateStateForLoginSuccess(state, id, userId, displayName, profilePhotoUrl, email, undefined, created);
    }
    case LOGOUT_USER_SUCCESS:
      const expireDate = new Date(0);
      document.cookie = cookie.serialize('accessToken', '', { expires: expireDate });
      document.cookie = cookie.serialize('userId', '', { expires: expireDate });
      document.cookie = cookie.serialize('username', '', { expires: expireDate });
      document.cookie = cookie.serialize('profilePhotoUrl', '', { expires: expireDate });
      document.cookie = cookie.serialize('email', '', { expires: expireDate });
      document.cookie = cookie.serialize('created', '', { expires: expireDate });
      return assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        userId: undefined,
        username: undefined,
        accessToken: undefined,
        profilePhotoUrl: undefined,
        email: undefined,
        autobiography: undefined,
        created: undefined,
        numOfMedia: 0,
        errMsg: ''
      });
    case RESET_PASSWORD_SUCCESS:
      return merge({}, state, {
        isFetching: false
      });
    case LOAD_USER_SUMMARY_FAILURE:
    {
      return merge({}, state, {
        isProcessing: {
          loadUserSummary: false
        }
      });
    }
    case UPDATE_PROFILE_PICTURE_FAILURE:
      return merge({}, state, {
        isProcessing: {
          updateProfilePhoto: false
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
    case REGISTER_USER_FAILURE:
    case LOGIN_USER_FAILURE:
    case RESET_PASSWORD_FAILURE:
      return merge({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errMsg: action.message
      });
    case EDIT_AUTOBIOGRAPHY:
      return merge({}, state, {
        autobiography: action.autobiography
      });
    case CLEAR_USER_ERR_MSG:
      return merge({}, state, {
        errMsg: ''
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
