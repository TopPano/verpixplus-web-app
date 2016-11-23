import 'core-js/fn/object/assign'

import React from 'react';
import cookie from 'cookie';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, match, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import routes from 'shared/routes';
import configureStore from 'store/configureStore';
import i18n from 'i18n';

import { DEFAULT_LOCALE } from 'constants/common';

const initialState = window.__INITIAL_STATE__ || {};
const store = configureStore(initialState);
const history = syncHistoryWithStore(browserHistory, store);
const locale = cookie.parse(document.cookie).locale || DEFAULT_LOCALE;
const rootElement = document.getElementById('app');

function loadLocale(localeToLoad) {
  if (localeToLoad === 'en') {
    // No need to load as UI already in English
    return Promise.resolve({});
  }

  // "": { "domain": "messages", "lang": "" }
  return fetch(`/static/lang/${localeToLoad}.json`).then((res) => {
    if (res.status >= 400) {
      throw new Error('Bad response from server');
    }

    return res.json();
  });
}

loadLocale(locale).then((localeData) => {
  const i18nTools = new i18n.Tools({ localeData, locale });

  // Render the main component into the dom
  match({ history, routes: routes() }, (error, redirectLocation, renderProps) => {
    render(
      <Provider store={store}>
        <i18n.Provider i18n={i18nTools}>
          <Router {...renderProps} />
        </i18n.Provider>
      </Provider>,
      rootElement
    );
  });
}).catch((err) => {
  console.error(err);
});
