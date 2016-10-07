'use strict';

import React, { Component, PropTypes } from 'react';

import Counter from 'components/Common/Counter';
import PhotoUploader from './PhotoUploader';
import Profile from './Profile';

if (process.env.BROWSER) {
  require('./Summary.css');
}

const propTypes = {
  username: PropTypes.string.isRequired,
  profilePhotoUrl: PropTypes.string.isRequired,
  autobiography: PropTypes.string,
  numOfMedia: PropTypes.number.isRequired
};

const defaultProps = {
};

class Summary extends Component {

  render() {
    const { username, profilePhotoUrl, autobiography, numOfMedia } = this.props;

    return (
      <div className='workspace-summary-component'>
        <div className='workspace-summary-fg' />
        <div className='workspace-summary-main container-fluid'>
          <div className='workspace-summary-profilebg' />
          <div className='workspace-summary-profile'>
            <Profile
              profilePhotoUrl={profilePhotoUrl}
              autobiography={autobiography}
            />
            <PhotoUploader />
            <Counter
              icon={ '/static/images/workspace/workspace-counter-media.png' }
              count={numOfMedia}
            />
          </div>
          <div className='workspace-summary-name'>{username}</div>
        </div>
      </div>
    );
  }
}

Summary.propTypes = propTypes;
Summary.defaultProps = defaultProps;

export default Summary;
