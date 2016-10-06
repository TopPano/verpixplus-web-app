'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import LandingPageContainer from './Landing';
import WorkSpacePageContainer from './WorkSpace';

class HomePageContainer extends Component {
  static propTyes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

  render() {
    const { isAuthenticated } = this.props.user;
    return (
      <div style={{height: '100%'}}>
        {isAuthenticated &&
          <WorkSpacePageContainer />
        }
        {!isAuthenticated &&
          <LandingPageContainer />
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default connect(mapStateToProps)(HomePageContainer);
