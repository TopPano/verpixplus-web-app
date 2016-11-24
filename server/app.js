/* eslint no-console:0 */

import path from 'path';
import Express from 'express';
import cookieParser from 'cookie-parser';
import qs from 'qs';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext, match } from 'react-router';

import merge from 'lodash/merge';
import Jed from 'jed';

import enLocaleData from '../public/static/lang/en.json';
import zhTwLocaleData from '../public/static/lang/zh-tw.json';

import {
  fetchComponentsData,
  detectLocale,
  genHeadContent,
  genDefaultContent
} from './utils';

import routes from 'shared/routes';
import configureStore from 'store/configureStore';
import i18n from 'i18n';
import Promise from 'lib/utils/promise';
import api from 'lib/api';

import serverConfig from 'etc/server';
import clientConfig from 'etc/client';

// Initialize localization
const i18nToolsRegistry = {
  'en': new i18n.Tools({ localeData: enLocaleData, locale: 'en' }),
  'zh-tw': new i18n.Tools({ localeData: zhTwLocaleData, locale: 'zh-tw' })
};

const app = new Express();

app.use('/static', Express.static('public/static'));
app.use(cookieParser());

// Use this middleware to set up hot module reloading via webpack
if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack.config');

  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// Use ejs for template
app.set('view engine', 'ejs');

// Redirect from http to https
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    // Check it is ELB health check or not
    if (req.headers['user-agent.match'] !== 'ELB-HealthChecker\/1.0') {
      // Check it is http request or not
      if (req.headers['x-forwarded-proto'] === 'http') {
        return res.redirect(301, `${clientConfig.staticUrl}${req.url}`);
      }
    }
    next();
  });
}

// Embed page request
app.get('/embed/@:mediaId', (req, res) => {
  const { mediaId } = req.params;

  api.media.getMedia(mediaId).then((response) => {
    const locale = detectLocale(req);
    const i18nTools = i18nToolsRegistry[locale];
    const content = genHeadContent(req, i18nTools, true, response.result);

    res.render('pages/embed', merge({}, content, {
      staticUrl: clientConfig.staticUrl
    }));
  }).catch((err) => {
    console.error(err.stack);
    res.end(err.message);
  });
});

// Terms of Use page request
app.get('/terms', (req, res) => {
  return res.sendFile(path.join(__dirname, '/../public/static/home/terms.html'));
});

// Privacy Policy page request
app.get('/privacy', (req, res) => {
  return res.sendFile(path.join(__dirname, '/../public/static/home/privacy.html'));
});

// This is fired every time the server side receives a request
app.use((req, res) => {
  let initState = {};
  const accessToken = req.cookies.accessToken || null;

  if (!accessToken && req.url === '/') {
    return res.sendFile(path.join(__dirname, '/../public/static/home/index.html'));
  }

  if (accessToken) {
    // restore the client state
    initState.user = {
      isFetching: false,
      isProcessing: {},
      isAuthenticated: true,
      accessToken,
      userId: req.cookies.userId,
      username: req.cookies.username,
      profilePhotoUrl: req.cookies.profilePhotoUrl,
      email: req.cookies.email,
      created: req.cookies.created,
      errMsgs: {}
    };
  }

  const store = configureStore(initState);

  const locale = detectLocale(req);
  const i18nTools = i18nToolsRegistry[locale];

  match({ routes: routes(accessToken), location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      res.send(500, err.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (!renderProps) {
      res.send(404, 'Not found')
    } else {
      fetchComponentsData({
        dispatch    : store.dispatch,
        components  : renderProps.components,
        params      : renderProps.params,
        location    : renderProps.location,
        userSession : initState.user,
        locale
      })
      .then(() => {
        // Grab the initial state from the store
        const initialState = store.getState();
        const html = renderToString(
          <Provider store={store}>
            <i18n.Provider i18n={i18nTools}>
              <RouterContext {...renderProps} />
            </i18n.Provider>
          </Provider>
        );
        const headContent = genHeadContent(req, i18nTools, false);
        const content = genDefaultContent(html, initialState, headContent, process.env.NODE_ENV);

        res.render('pages/default', content);
      })
      .catch(err => {
        console.error(err.stack);
        res.end(err.message);
      });
    }
  });
});

app.listen(serverConfig.port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> Listening on port ${serverConfig.port}.`);
  }
});
