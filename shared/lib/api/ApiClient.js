import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import isEmpty from 'lodash/isEmpty';
import cookie from 'cookie';
import { normalize } from 'normalizr';

import config from 'etc/client';
import Promise from 'lib/utils/promise';

export default class ApiClient {
  constructor() {
    if (process.env.BROWSER) {
      this.token = cookie.parse(document.cookie).accessToken;
    } else {
      this.token = null;
    }
  }

  get({url, params={}, authenticated=false, schema}) {
    return this.request({
      url,
      method: 'get',
      params,
      authenticated,
      schema
    });
  }

  post({ url, payload = {}, authenticated = false, schema, contentType = 'application/json' }) {
    return this.request({
      url,
      method: 'post',
      body: payload,
      authenticated,
      schema,
      contentType
    });
  }

  put({ url, payload = {}, authenticated = false, schema, contentType = 'application/json' }) {
    return this.request({
      url,
      method: 'put',
      body: payload,
      authenticated,
      schema,
      contentType
    });
  }

  delete({url, authenticated=false}) {
    return this.request({
      url,
      method: 'delete',
      authenticated
    });
  }

  request({ url, method, params = {}, body = {}, authenticated, schema, contentType = 'application/json' }) {
    const urlWithQuery = isEmpty(params) ? `${url}` : `${url}?${queryString.stringify(params)}`;
    const init = {
      method,
      headers: {
        Accept: 'application/json'
      }
    };

    if (authenticated) {
      let token = null;
      if (process.env.BROWSER) {
        token = cookie.parse(document.cookie).accessToken;
      } else {
        token = this.token;
      }
      if (token) {
        init.headers['Authorization'] = `${token}`;
      } else {
        let error = new Error('No access token saved!');
        error.status = 401;
        return Promise.reject(error);
      }
    }

    if (method !== 'get' && method !== 'head') {
      if (contentType === 'multipart/form-data') {
        init.body = body;
      } else {
        init.body = JSON.stringify(body);
      }
    }

    return fetch(`${config.apiRoot}/${urlWithQuery}`, init).then((res) => {
      if (res.status >= 400) {
        return Promise.reject({ status: res.status, message: res.statusText });
      }
      return res.json();
    }).then((data) => {
      if (data && !data.error) {
        if (schema) {
          return normalize(data, schema);
        }
        return data;
      }
      return Promise.reject(data.error);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  setAuthToken(authToken) {
    this.token = authToken;
  }
}
