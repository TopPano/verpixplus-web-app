/* eslint no-console:0 */

import path from 'path';
import Express from 'express';
import cookieParser from 'cookie-parser';
import qs from 'qs';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';

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
  genDefaultContent,
  genStaticPages
} from './utils';

import routes from 'shared/routes';
import configureStore from 'store/configureStore';
import i18n from 'i18n';
import Promise from 'lib/utils/promise';
import api from 'lib/api';

import {
  MEDIA_TYPE,
  GA_SDK
} from 'constants/common';
import serverConfig from 'etc/server';
import clientConfig from 'etc/client';
import exterApiConfig from 'etc/external-api';

// Initialize localization
const i18nToolsRegistry = {
  'en': new i18n.Tools({ localeData: enLocaleData, locale: 'en' }),
  'zh-tw': new i18n.Tools({ localeData: zhTwLocaleData, locale: 'zh-tw' })
};

const homePages = genStaticPages('/home', i18nToolsRegistry, process.env.NODE_ENV);
const termsPages = genStaticPages('/terms', i18nToolsRegistry, process.env.NODE_ENV);
const privacyPages = genStaticPages('/privacy', i18nToolsRegistry, process.env.NODE_ENV);

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

// Setup smtp trasporter
// TODO: how to authenticate without explict password ?
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'verpix.smtp@gmail.com',
    pass: 'nhlcltsvexgdatza'
  }
});

// Mail sending request
app.post('/mail', bodyParser.json(), (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const {
    name,
    email,
    subject,
    message
  } = req.body;

  const mailOpts = {
    from: email,
    to: 'service@verpix.me',
    subject: `${subject} (from ${email})`,
    text: `From: ${email}\nName: ${name}\nSubject: ${subject}\nMessage:\n${message}`
  };

  transporter.sendMail(mailOpts, (err, info) => {
    if (err) {
      console.error('err', err);
      return res.end(err);
    }
    return res.end(JSON.stringify({
      success: 'Email is sent successfully',
      status: 200
    }));
  });
});

// Embed page request
app.get('/embed/@:mediaId', (req, res) => {
  const { mediaId } = req.params;

  api.media.getMedia(mediaId).then((response) => {
    const { type } = response.result;
    const locale = detectLocale(req);
    const i18nTools = i18nToolsRegistry[locale];
    const url = `${req.protocol}://${req.get('Host')}${req.url}`;
    const content = genHeadContent(url, i18nTools, true, response.result);

    res.render('pages/embed', merge({}, content, {
      type,
      MEDIA_TYPE,
      staticUrl: clientConfig.staticUrl,
      page: `/embed/@${mediaId}`,
      ga: {
        active: process.env.NODE_ENV === 'production',
        sdk: GA_SDK,
        trackingCode: exterApiConfig.ga.trackingCode
      },
      query: req.query
    }));
  }).catch((err) => {
    console.error(err.stack);
    res.end(err.message);
  });
});

// Terms of Use page request
app.get('/terms', (req, res) => {
  const locale = detectLocale(req);
  return res.end(termsPages[locale]);
});

// Privacy Policy page request
app.get('/privacy', (req, res) => {
  const locale = detectLocale(req);
  return res.end(privacyPages[locale]);
});

// This is fired every time the server side receives a request
app.use((req, res) => {
  let initState = {};
  const accessToken = req.cookies.accessToken || null;

  const locale = detectLocale(req);
  const i18nTools = i18nToolsRegistry[locale];

  if (!accessToken && req.url === '/') {
    return res.end(homePages[locale]);
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
        const url = `${req.protocol}://${req.get('Host')}${req.url}`;
        const headContent = genHeadContent(url, i18nTools, false);
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
