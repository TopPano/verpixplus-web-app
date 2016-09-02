/* eslint react/no-did-mount-set-state: 0 */
import React, { Component, PropTypes } from 'react';

import { isIframe } from '../../lib/devices';
import HeaderContainer from '../../containers/layouts/Header';
import Content from './Content';
import Footer from './Footer';

if (process.env.BROWSER) {
  require('normalize.css');
  require('./MainLayout.css');
}

export default class MainLayout extends Component {
  static propTypes = {
    children: PropTypes.object,
    currentLocation: PropTypes.string.isRequired
  };

  render() {
    const { currentLocation } = this.props;
    const matchViewer = currentLocation.match(/(\/viewer\/@)+/);
    const isInViewerPage = matchViewer && matchViewer.index === 0;
    const isInEmbeddedViewer = isInViewerPage && isIframe();

    if(isInEmbeddedViewer) {
      document.body.style.overflow = 'hidden';
    }

    return (
      <div>
        {!isInEmbeddedViewer && <HeaderContainer />}
          <Content>
            {this.props.children}
          </Content>
        {!isInEmbeddedViewer && <Footer />}
      </div>
    );
  }
}
