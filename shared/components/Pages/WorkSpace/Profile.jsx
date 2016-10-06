'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Profile.css');
}

const propTypes = {
  profilePhotoUrl: PropTypes.string.isRequired,
  autobiography: PropTypes.string.isRequired
};

const defaultProps = {
};

class Profile extends Component {
  render() {
    return (
      <div className='workspace-profile-component'>
        <img className='workspace-profile-picture' src={ this.props.profilePhotoUrl } alt='profile picture' />
      </div>
    );
  }
}

Profile.propTypes = propTypes;
Profile.defaultProps = defaultProps;

export default Profile;

