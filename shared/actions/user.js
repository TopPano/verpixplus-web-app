import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import merge from 'lodash/merge';

import api from 'lib/api';
import config from 'etc/client';
import {
  imageBlobToDataUrl,
  Promise
} from 'lib/utils';
import { pushNotification } from './notifications';
import { PROFILE_PICTURE_SIZE } from 'constants/common';
import { NOTIFICATIONS } from 'constants/notifications';

function handleError(dispatch, type, err) {
  dispatch({
    type,
    err
  });
}

function clearMsg(type) {
  return (dispatch) => {
    dispatch({
      type
    });
  }
}

export const CLEAR_ERR_MSG_CHANGE_PASSWORD = 'CLEAR_ERR_MSG_CHANGE_PASSWORD';

export const clearErrMsgChangePassword = clearMsg.bind(this, CLEAR_ERR_MSG_CHANGE_PASSWORD);

export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';

function requestRegistration() {
  return {
    type: REGISTER_USER_REQUEST
  }
}

function registerError(message) {
  return {
    type: REGISTER_USER_FAILURE,
    message
  }
}

export function registerUser(creds, successRedirectUrl = '/') {
  return (dispatch) => {
    dispatch(requestRegistration());
    return api.users.signUp(creds).then(() => {
      dispatch(loginUser({
        email: creds.email,
        password: creds.password
      }, successRedirectUrl));
    }).catch((err) => {
      dispatch(registerError(err.message));
    });
  }
}

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

function requestLogin() {
  return {
    type: LOGIN_USER_REQUEST
  }
}

function loginSuccess(actionType, response) {
  return {
    type: actionType,
    response
  }
}

function loginError(message) {
  return {
    type: LOGIN_USER_FAILURE,
    message
  }
}

export function loginUser(creds, successRedirectUrl = '/') {
  return (dispatch) => {
    dispatch(requestLogin());
    return api.users.signIn(creds).then((res) => {
      dispatch(loginSuccess(LOGIN_USER_SUCCESS, res));
      dispatch(push(successRedirectUrl));
    }).catch((err) => {
      dispatch(loginError(err.message));
    });
  }
}

export const FACEBOOK_TOKEN_LOGIN_SUCCESS = 'FACEBOOK_TOKEN_LOGIN_SUCCESS';

export function facebookTokenLogin(token, successRedirectUrl = '/') {
  return (dispatch) => {
    if (!token) {
      return dispatch(loginError('Missing Facebook Authentication Token'));
    }

    let init = {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    dispatch(requestLogin());
    fetch(`${config.apiRoot}/users/auth/facebook/token?include=user`, init).then((res) => {
      if (res.status >= 400) {
        var error = new Error(res.statusText);
        error.status = res.status;
        return Promise.reject(error);
      }
      return res.json();
    }).then((data) => {
      if(data) {
        dispatch(loginSuccess(FACEBOOK_TOKEN_LOGIN_SUCCESS, data));
        dispatch(push(successRedirectUrl));
      } else {
        var error = new Error('Failed to get user login data');
        error.status = 500;
        Promise.reject(error);
      }
    }).catch((err) => {
      dispatch(loginError(err.message));
    });
  }
}

export const CLEAR_USER_ERR_MSG = 'CLEAR_USER_ERR_MSG';

export function clearUserErrMsg() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_USER_ERR_MSG
    });
  }
}

export const LOGOUT_USER_REQUEST = 'LOGOUT_USER_REQUEST';
export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS';

function requestLogout() {
  return {
    type: LOGOUT_USER_REQUEST
  }
}

function receiveLogout() {
  return {
    type: LOGOUT_USER_SUCCESS
  }
}

export function logoutUser(successRedirectUrl = '/') {
  return (dispatch) => {
    dispatch(requestLogout());
    dispatch(receiveLogout());
    if (process.env.BROWSER) {
      window.location = successRedirectUrl;
    }
  }
}

export const LOAD_USER_SUMMARY_REQUEST = 'LOAD_USER_SUMMARY_REQUEST';
export const LOAD_USER_SUMMARY_SUCCESS = 'LOAD_USER_SUMMARY_SUCCESS';
export const LOAD_USER_SUMMARY_FAILURE = 'LOAD_USER_SUMMARY_FAILURE';

export function loadUserSummary({ id, params = {}, userSession = {} }) {
  return (dispatch) => {
    let queryId;
    if (id) {
      queryId = id;
    } else if (params.id) {
      queryId = params.id;
    } else if (userSession.userId) {
      queryId = userSession.userId;
    }

    if (!queryId) {
      return dispatch({
        type: LOAD_USER_SUMMARY_FAILURE,
        error: 'No user id specified'
      });
    }

    dispatch({
      type: LOAD_USER_SUMMARY_REQUEST
    });

    return api.users.getProfile(queryId, userSession.accessToken).then((response) => {
      dispatch({
        type: LOAD_USER_SUMMARY_SUCCESS,
        response
      });
    }).catch((error) => {
      dispatch({
        type: LOAD_USER_SUMMARY_FAILURE,
        error
      });
    });
  };
}

export const UPDATE_PROFILE_PICTURE_REQUEST = 'UPDATE_PROFILE_PICTURE_REQUEST';
export const UPDATE_PROFILE_PICTURE_SUCCESS = 'UPDATE_PROFILE_PICTURE_SUCCESS';
export const UPDATE_PROFILE_PICTURE_FAILURE = 'UPDATE_PROFILE_PICTURE_FAILURE';

const DATA_URL_PREFIX = 'data:image/jpeg;base64,';

function updateProfilePictureRequest() {
  return {
    type: UPDATE_PROFILE_PICTURE_REQUEST
  };
}

function updateProfilePictureSuccess(response) {
  return {
    type: UPDATE_PROFILE_PICTURE_SUCCESS,
    response
  };
}

export function updateProfilePicture({ userId, profilePicture, userSession = {} }) {
  return (dispatch) => {
    let profilePhotoUrl;

    dispatch(updateProfilePictureRequest());

    imageBlobToDataUrl(profilePicture, PROFILE_PICTURE_SIZE, true).then((imgDataUrl) => {
      const payload = {
        image: imgDataUrl.slice(DATA_URL_PREFIX.length)
      };
      profilePhotoUrl = imgDataUrl;

      return api.users.postProfilePicture(userId, payload, userSession.accessToken);
    }).then((res) => {
      dispatch(updateProfilePictureSuccess(merge({}, res, { profilePhotoUrl })));
      dispatch(pushNotification(NOTIFICATIONS.UPDATE_PROFILE_PICTURE_SUCCESS));
    }).catch((err) => {
      handleError(dispatch, UPDATE_PROFILE_PICTURE_FAILURE, err);
    });
  };
}

export const EDIT_AUTOBIOGRAPHY = 'EDIT_AUTOBIOGRAPHY';

export function editAutobiography(autobiography) {
  return (dispatch) => {
    dispatch({
      type: EDIT_AUTOBIOGRAPHY,
      autobiography
    })
  };
}

export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

function updateProfileRequest() {
  return {
    type: UPDATE_PROFILE_REQUEST
  }
}

function updateProfileSuccess(response) {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    response
  };
}

export function updateProfile({ userId, autobiography, userSession = {} }) {
  return (dispatch) => {
    dispatch(updateProfileRequest());

    return api.users.putProfile(userId, { autobiography }, userSession.accessToken).then((res) => {
      dispatch(updateProfileSuccess(res));
      dispatch(pushNotification(NOTIFICATIONS.UPDATE_PROFILE_SUCCESS));
    }).catch((err) => {
      handleError(dispatch, UPDATE_PROFILE_FAILURE, err);
    });
  };
}

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE';

function changePasswordRequest() {
  return {
    type: CHANGE_PASSWORD_REQUEST
  }
}

function changePasswordSuccess() {
  return {
    type: CHANGE_PASSWORD_SUCCESS
  };
}

export function changePassword({ userId, oldPassword, newPassword, userSession = {} }) {
  return (dispatch) => {
    dispatch(changePasswordRequest());

    return api.users.postPassword(userId, { oldPassword, newPassword }, userSession.accessToken).then(() => {
      dispatch(changePasswordSuccess());
      dispatch(pushNotification(NOTIFICATIONS.CHANGE_PASSWORD_SUCCESS));
    }).catch((err) => {
      handleError(dispatch, CHANGE_PASSWORD_FAILURE, err);
    });
  };
}

export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';

function resetPasswordRequest() {
  return {
    type: RESET_PASSWORD_REQUEST
  }
}

function resetPasswordSuccess() {
  return {
    type: RESET_PASSWORD_SUCCESS
  };
}

export function resetPassword({ email }) {
  return (dispatch) => {
    dispatch(resetPasswordRequest());

    return api.users.resetPassword({ email }).then(() => {
      dispatch(resetPasswordSuccess());
      dispatch(push('/pwd/reset/sent'));
    }).catch((err) => {
      dispatch({
        type: RESET_PASSWORD_FAILURE,
        message: err.message
      })
    });
  };
}
