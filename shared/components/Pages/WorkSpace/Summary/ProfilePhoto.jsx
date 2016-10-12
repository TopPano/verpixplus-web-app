'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./ProfilePhoto.css');
}

const propTypes = {
  profilePhotoUrl: PropTypes.string.isRequired
};

const defaultProps = {
};

class ProfilePhoto extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { profilePhotoUrl } = this.props;

    return (
      <div className="profile-photo-component">
        <img
          className="profile-photo"
          src={profilePhotoUrl}
          alt="profile picture"
        />
      </div>
    );
  }
}

ProfilePhoto.propTypes = propTypes;
ProfilePhoto.defaultProps = defaultProps;

export default ProfilePhoto;
