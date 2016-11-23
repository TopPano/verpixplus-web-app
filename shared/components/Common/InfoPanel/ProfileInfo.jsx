'use strict';

import React, { PropTypes, Component } from 'react';

import ProfilePhoto from './ProfilePhoto';

if (process.env.BROWSER) {
  require('./ProfileInfo.css');
}

const propTypes = {
  userId: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  profilePhotoUrl: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  numOfMedia: PropTypes.number.isRequired,
  isProcessing: PropTypes.object.isRequired,
  updateProfilePhoto: PropTypes.func.isRequired
};

const defaultProps = {
};

class ProfileInfo extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);
  }

  render() {
    const { l } = this.context.i18n;
    const {
      userId,
      isAuthenticated,
      profilePhotoUrl,
      username,
      email,
      numOfMedia,
      isProcessing,
      updateProfilePhoto
    } = this.props;

    return (
      <div className="profile-info-component">
        <ProfilePhoto
          userId={userId}
          isAuthenticated={isAuthenticated}
          profilePhotoUrl={profilePhotoUrl}
          isProcessing={isProcessing}
          updateProfilePhoto={updateProfilePhoto}
        />
        {
          isAuthenticated &&
          <div className="profile-info">
            <div className="profile-info-username">{username}</div>
            <div className="profile-info-email">{email}</div>
            <div className="profile-info-media">
              <img
                src="/static/images/menu/cases.svg"
                alt="Media"
                width="20"
                height="19"
              />
              <div className="profile-info-media-count">{`${numOfMedia} ${l('Media')}`}</div>
            </div>
          </div>
        }
      </div>
    );
  }
}

ProfileInfo.propTypes = propTypes;
ProfileInfo.defaultProps = defaultProps;

export default ProfileInfo;
