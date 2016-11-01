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

  get({url, params = {}, requireAuth, schema}) {
    return this.request({
      url,
      method: 'get',
      params,
      requireAuth,
      schema
    });
  }

  post({ url, payload = {}, requireAuth, schema, contentType = 'application/json' }) {
    return this.request({
      url,
      method: 'post',
      body: payload,
      requireAuth,
      schema,
      contentType
    });
  }

  put({ url, payload = {}, requireAuth, schema, contentType = 'application/json' }) {
    return this.request({
      url,
      method: 'put',
      body: payload,
      requireAuth,
      schema,
      contentType
    });
  }

  delete({ url, requireAuth }) {
    return this.request({
      url,
      method: 'delete',
      requireAuth
    });
  }

  request({ url, method, params = {}, body = {}, requireAuth = false, schema, contentType = 'application/json' }) {
    const urlWithQuery = isEmpty(params) ? `${url}` : `${url}?${queryString.stringify(params)}`;
    const init = {
      method,
      headers: {
        Accept: 'application/json'
      }
    };

    if (requireAuth) {
      if (this.token) {
        init.headers['Authorization'] = `${this.token}`;
      } else {
        let error = new Error('Unauthorized');
        error.status = 401;
        return Promise.reject(error);
      }
    }

    if (method !== 'get' && method !== 'head') {
      if (contentType === 'application/json') {
        init.body = JSON.stringify(body);
        init.headers['Content-Type'] = contentType;
      } else {
        init.body = body;
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
