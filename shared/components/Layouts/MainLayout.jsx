/* eslint react/no-did-mount-set-state: 0 */
import React, { Component, PropTypes } from 'react';

import HeaderContainer from '../../containers/layouts/Header';
import Content from './Content';
import Footer from './Footer';

if (process.env.BROWSER) {
  require('./MainLayout.css');
}

export default class MainLayout extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  render() {
    return (
      <div>
        <HeaderContainer />
        <Content>
          {this.props.children}
        </Content>
        <Footer />
      </div>
    );
  }
}
