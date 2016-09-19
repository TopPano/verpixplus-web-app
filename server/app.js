/* eslint no-console:0 */

import path from 'path';
import Express from 'express';
import cookieParser from 'cookie-parser';
import qs from 'qs';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext, match } from 'react-router';

import {
  fetchComponentsData,
  genShareContent,
  renderHTML
} from './utils';

import routes from 'shared/routes';
import configureStore from 'store/configureStore';
import Promise from 'lib/utils/promise';

import serverConfig from 'etc/server';
import clientConfig from 'etc/client';

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

// This is fired every time the server side receives a request
app.use((req, res) => {
  let initState = {};
  const accessToken = req.cookies.accessToken || null;
  const matchViewer = req.url.match(/(\/viewer\/@)+/);
  const isViewerPage = matchViewer && matchViewer.index === 0;

  if (accessToken) {
    // restore the client state
    initState.user = {
      isFetching: false,
      isAuthenticated: true,
      userId: req.cookies.userId,
      username: req.cookies.username,
      profilePhotoUrl: req.cookies.profilePhotoUrl,
      email: req.cookies.email,
      created: req.cookies.created
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
      fetchComponentsData(
        store.dispatch,
        renderProps.components,
        renderProps.params,
        renderProps.location,
        accessToken
      )
      .then(() => {
        // Grab the inital state from the store
        const initialState = store.getState();
        const html = renderToString(
          <Provider store={store}>
            <div>
              <RouterContext {...renderProps} />
            </div>
          </Provider>
        );
        const shareContent = genShareContent(req, isViewerPage, initialState.post);

        return renderHTML(html, initialState, clientConfig, shareContent, process.env.NODE_ENV);
      })
      .then(html => {
        // Send the rendered page back to the client
        res.end(html);
      })
      .catch(err => {
        console.log(err.stack);
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
