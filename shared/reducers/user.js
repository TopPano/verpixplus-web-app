import merge from 'lodash/merge';
import assign from 'lodash/assign';
import cookie from 'cookie';
import {
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
  LOGOUT_USER_SUCCESS
} from '../actions/user';
import { DEFAULT_PROFILE_PHOTO_URL } from 'constants/common';

const DEFAULT_STATE = {
  isFetching: false,
  isAuthenticated: process.env.BROWSER ? Boolean(cookie.parse(document.cookie).accessToken) : false,
  userId: undefined,
  username: undefined,
  profilePhotoUrl: undefined,
  email: undefined,
  created: undefined,
  errMsg: ''
};

function updateStateForLoginSuccess(
  state,
  accessToken,
  userId,
  username,
  profilePhotoUrl,
  email,
  created
) {
  let _profilePhotoUrl = profilePhotoUrl ? profilePhotoUrl : DEFAULT_PROFILE_PHOTO_URL;

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
    email,
    created,
    errMsg: ''
  });
}

export default function user(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case REGISTER_USER_REQUEST:
    case LOGIN_USER_REQUEST:
    case LOGOUT_USER_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return merge({}, state, {
        isFetching: true,
        isAuthenticated: false
      });
    case LOGIN_USER_SUCCESS: {
      const { id, userId, created, user: { username, profilePhotoUrl, email } } = action.response;
      return updateStateForLoginSuccess(state, id, userId, username, profilePhotoUrl, email, created);
    }
    case FACEBOOK_TOKEN_LOGIN_SUCCESS: {
      const {
        token: { id, userId, created },
        user: { profilePhotoUrl, email },
        identity: { profile: { displayName } }
      } = action.response.auth;
      return updateStateForLoginSuccess(state, id, userId, displayName, profilePhotoUrl, email, created);
    }
    case LOGOUT_USER_SUCCESS:
      let expireDate = new Date(0);
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
        created: undefined,
        errMsg: ''
      });
    case RESET_PASSWORD_SUCCESS:
      return merge({}, state, {
        isFetching: false
      });
    case REGISTER_USER_FAILURE:
    case LOGIN_USER_FAILURE:
    case RESET_PASSWORD_FAILURE:
      return merge({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errMsg: action.message
      });
    case CLEAR_USER_ERR_MSG:
      return merge({}, state, {
        errMsg: ''
      });
    default:
      return state;
  }
}
