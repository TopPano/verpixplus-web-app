'use strict';

import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import isArray from 'lodash/isArray';
import classNames from 'classnames';

import Loading from 'components/Common/Loading';
import CONTENT from 'content/workspace/en-us.json';

if (process.env.BROWSER) {
  require('./ProfilePhoto.css');
}

const propTypes = {
  userId: PropTypes.string.isRequired,
  profilePhotoUrl: PropTypes.string.isRequired,
  isProcessing: PropTypes.object.isRequired,
  updateProfilePicture: PropTypes.func.isRequired
};

const defaultProps = {
};

class ProfilePhoto extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to memeber functions
    this.handleClick = this.handleClick.bind(this);
    this.handleDropFile = this.handleDropFile.bind(this);
  }

  // Handler for clicking profile picture
  handleClick() {
    this.refs.dropzone.open();
  }

  // Handler for the file is dropped to zone
  handleDropFile(files) {
    const {
      userId,
      updateProfilePicture,
      isProcessing
    } = this.props;

    if (!isProcessing.updateProfilePicture) {
      if (isArray(files) && files[0]) {
        updateProfilePicture({
          userId,
          profilePicture: files[0]
        });
      }
    }
  }

  render() {
    const {
      profilePhotoUrl,
      isProcessing
    } = this.props;
    const componentClass = classNames({
      'profile-photo-component': true,
      'clickable': !isProcessing.updateProfilePicture
    });

    return (
      <Dropzone
        ref="dropzone"
        className={componentClass}
        multiple={false}
        accept="image/jpeg,image/png"
        onDrop={this.handleDropFile}
        onClick={this.handleClick}
      >
        <img
          className="profile-photo"
          title={CONTENT.PROFILE_PICTURE.TITLE}
          src={profilePhotoUrl}
          alt="profile picture"
        />
        {
          isProcessing.updateProfilePicture &&
          <div className="profile-photo-overlay container-center-row">
            <Loading size={30} />
          </div>
        }
      </Dropzone>
    );
  }
}

ProfilePhoto.propTypes = propTypes;
ProfilePhoto.defaultProps = defaultProps;

export default ProfilePhoto;
