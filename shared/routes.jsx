import React from 'react';
import { Route } from 'react-router';

import App from './containers/App';
import MainLayout from './containers/layouts/MainLayout';

import HomePageContainer from './containers/pages/Home';
import ExplorerPageContainer from './containers/pages/Explorer';
import ViewerPageContainer from './containers/pages/Viewer';
import PersonalPageContainer from './containers/pages/Personal';
import SignInPageContainer from './containers/pages/SignIn';
import FAQPageComponent from './components/Pages/FAQ';

export default (
  <Route component={App}>
    <Route component={MainLayout}>
      <Route component={HomePageContainer} path='/' />
      <Route component={SignInPageContainer} path='/signin' />
      <Route component={ViewerPageContainer} path='/viewer/@:postId' />
      <Route component={ExplorerPageContainer} path='/explore' />
      <Route component={FAQPageComponent} path='/faq' />
      <Route component={ViewerPageContainer} path='/viewer/@:postId' />
      <Route component={PersonalPageContainer} path='/@:id' />
    </Route>
  </Route>
);
