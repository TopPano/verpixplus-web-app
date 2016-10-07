import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';

import api from 'lib/api';
import config from 'etc/client';
import { Promise } from 'lib/utils';

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
    if (!creds.username || !creds.email || !creds.password) {
      const message = 'Missing Registration Information';

      return dispatch(registerError(message));
    }

    let init = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(creds)
    }
    dispatch(requestRegistration());
    fetch(`${config.apiRoot}/users`, init).then((res) => {
      if (res.status >= 400) {
        var error = new Error(res.statusText);
        error.status = res.status;
        return Promise.reject(error);
      }
      return res.json();
    }).then((data) => {
      if(data) {
        dispatch(loginUser({
          email: creds.email,
          password: creds.password
        }, successRedirectUrl));
      } else {
        var error = new Error('Failed to register new user');
        error.status = 500;
        Promise.reject(error);
      }
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
    if (!creds.email || !creds.password) {
      const message = 'Missing Login Information';

      return dispatch(loginError(message));
    }

    const init = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(creds)
    }
    dispatch(requestLogin());
    fetch(`${config.apiRoot}/users/login?include=user`, init).then((res) => {
      if (res.status >= 400) {
        var error = new Error(res.statusText);
        error.status = res.status;
        return Promise.reject(error);
      }
      return res.json();
    }).then((data) => {
      if(data) {
        dispatch(loginSuccess(LOGIN_USER_SUCCESS, data));
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

export function logoutUser() {
  return (dispatch) => {
    dispatch(requestLogout());
    dispatch(receiveLogout());
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
      if (error.status === 401) {
        dispatch(push('/'));
      }
    });
  };
}
