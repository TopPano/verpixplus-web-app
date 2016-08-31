import React from 'react';
import { Route, Redirect } from 'react-router';

import App from './containers/App';
import MainLayout from './containers/layouts/MainLayout';

import HomePageContainer from './containers/pages/Home';
import SignInPageContainer from './containers/pages/SignIn';
import FAQPageComponent from './components/Pages/FAQ';

export default (
  <Route component={App}>
    <Route component={MainLayout}>
      <Route component={HomePageContainer} path='/' />
      <Route component={FAQPageComponent} path='/faq' />
      <Route component={SignInPageContainer} path='/signin' />
      <Redirect from='*' to='/' />
    </Route>
  </Route>
);
