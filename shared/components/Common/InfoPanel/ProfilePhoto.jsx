'use strict';

import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import isArray from 'lodash/isArray';
import classNames from 'classnames';

import Loading from 'components/Common/Loading';
import CONTENT from 'content/workspace/en-us.json';
import { DEFAULT_PROFILE_PHOTO_URL } from 'constants/common';

if (process.env.BROWSER) {
  require('./ProfilePhoto.css');
}

const propTypes = {
  userId: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  profilePhotoUrl: PropTypes.string.isRequired,
  isProcessing: PropTypes.object.isRequired,
  updateProfilePhoto: PropTypes.func.isRequired
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
    if (!this.props.isProcessing.updateProfilePhoto) {
      this.refs.dropzone.open();
    }
  }

  // Handler for the file is dropped to zone
  handleDropFile(files) {
    const {
      userId,
      updateProfilePhoto,
      isProcessing
    } = this.props;

    if (!isProcessing.updateProfilePhoto) {
      if (isArray(files) && files[0]) {
        updateProfilePhoto({
          userId,
          profilePicture: files[0]
        });
      }
    }
  }

  render() {
    const {
      isAuthenticated,
      profilePhotoUrl,
      isProcessing
    } = this.props;
    const editableImgClass = classNames({
      'profile-photo editable circle': true,
      'solid-border': profilePhotoUrl !== DEFAULT_PROFILE_PHOTO_URL,
      'clickable': !isAuthenticated || !isProcessing.updateProfilePhoto
    });

    return (
      <div className="profile-photo-component circle">
        {
          isAuthenticated ?
          <Dropzone
            ref="dropzone"
            className="circle"
            multiple={false}
            accept="image/jpeg,image/png"
            disableClick={isProcessing.updateProfilePhoto}
            onDrop={this.handleDropFile}
          >
            <img
              className={editableImgClass}
              title={CONTENT.PROFILE_PICTURE.TITLE}
              src={isAuthenticated ? profilePhotoUrl : DEFAULT_PROFILE_PHOTO_URL}
              alt="profile photo"
            />
            {
              isProcessing.updateProfilePhoto &&
              <div className="profile-photo-overlay circle container-center-row">
                <Loading size={30} />
              </div>
            }
          </Dropzone> :
          <img
            className="profile-photo circle clickable"
            src={isAuthenticated ? profilePhotoUrl : DEFAULT_PROFILE_PHOTO_URL}
            alt="profile photo"
          />
        }
      </div>
    );
  }
}

ProfilePhoto.propTypes = propTypes;
ProfilePhoto.defaultProps = defaultProps;

export default ProfilePhoto;
