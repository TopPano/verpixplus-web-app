'use strict';

import React, { Component } from 'react';

import Landing from 'components/Pages/Landing';

class LandingPageContainer extends Component {
  static propTyes = {
  };

  render() {
    return (
      <Landing>
        {this.props.children}
      </Landing>
    );
  }
}

export default LandingPageContainer;
