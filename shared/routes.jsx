import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';
import cookie from 'cookie';

import App from './containers/App';
import MainLayout from './containers/layouts/MainLayout';

import HomePageContainer from './containers/pages/Home';
import SignInPageContainer from './containers/pages/SignIn';
import FAQPageComponent from './components/Pages/FAQ';

function isAuthenticated(accessToken) {
  // If access token is provided by function call or in browser cookie,
  // then it is authenticated
  return (
    accessToken ?
    true :
    process.env.BROWSER ? Boolean(cookie.parse(document.cookie).accessToken) : false
  );
}

function redirectIfAuth(accessToken, nextState, replace) {
  if (isAuthenticated(accessToken)) {
    replace('/');
  }
}

// Uncomment the function is needed
/*
function redirectIfNotAuth(accessToken, nextState, replace) {
  if (!isAuthenticated(accessToken)) {
    replace('/');
  }
}
*/

export default function routes(accessToken) {
  const _redirectIfAuth = redirectIfAuth.bind(this, accessToken);

  return (
    <Route component={App}>
      <Route path="/" component={MainLayout}>
        <IndexRoute component={HomePageContainer} />
        <Route path="faq"component={FAQPageComponent} />
        <Route path="signin" component={SignInPageContainer} onEnter={_redirectIfAuth} />
        <Redirect from="*" to="/" />
      </Route>
    </Route>
  );
}
