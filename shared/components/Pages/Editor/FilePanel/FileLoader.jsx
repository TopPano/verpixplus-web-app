'use strict';

import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import startsWith from 'lodash/startsWith';
import isArray from 'lodash/isArray';

import {
  ACCEPT_TYPES,
  VIDEO_DURATION_LIMIT
} from 'constants/editor';
import { MEDIA_TYPE } from 'constants/common';
import FlatButton from 'components/Common/FlatButton';
import Modal from 'components/Common/Modal';
import { sprintf } from 'lib/utils';

if (process.env.BROWSER) {
  require('./FileLoader.css');
}

const propTypes = {
  storageId: PropTypes.string.isRequired,
  convert: PropTypes.func.isRequired
};

const defaultProps = {
};

class FileLoader extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);

    // Bind "this" to callback functions
    this.convert = this.convert.bind(this);
    this.handleDropFile = this.handleDropFile.bind(this);
    this.handleClickBtn = this.handleClickBtn.bind(this);

    // Initialize state
    this.state = {
      source: null
    };

    // Accepted MIME types for dropzone
    // TODO:
    // 1. Support image (panophoto)
    // 2. Support for more image and video types
    this.acceptTypes = '';
    this.acceptTypes += ACCEPT_TYPES.IMAGE.reduce((pre, cur) => pre + `image/${cur},`, '');
    this.acceptTypes += ACCEPT_TYPES.VIDEO.reduce((pre, cur) => pre + `video/${cur},`, '');
  }

  // Convert video to livephoto or image to panophoto
  convert(mediaType) {
    const {
      storageId,
      convert
    } = this.props
    const { source } = this.state;

    convert({
      storageId,
      mediaType,
      source
    });
  }

  // Handler for the file is dropped to zone
  handleDropFile(files) {
    if (isArray(files) && files[0]) {
      const {
        storageId,
        convert
      } = this.props
      // We limit user only can choose one file
      const file = files[0];

      this.setState({
        source: file.preview
      });

      if (startsWith(file.type, 'image')) {
        // Handle image (panophoto)
        convert({
          storageId,
          mediaType: MEDIA_TYPE.PANO_PHOTO,
          source: file.preview
        });
      } else {
        // Handle video (livephoto)
        const video = document.createElement('VIDEO');
        // Check video duration exceeds the limit or not
        video.addEventListener('loadedmetadata' , () => {
          if (video.duration <= VIDEO_DURATION_LIMIT) {
            convert({
              storageId,
              mediaType: MEDIA_TYPE.LIVE_PHOTO,
              source: file.preview
            });
          } else {
            this.refs.modal.open();
          }
        });
        video.setAttribute('src', file.preview);
      }
    }
  }

  // Handler for button is click, to choose file
  handleClickBtn() {
    this.refs.dropzone.open();
  }

  render() {
    const { l, nl } = this.context.i18n;
    const {
      storageId,
      convert
    } = this.props
    const { source } = this.state;
    const modalProps = {
      ref: 'modal',
      title: l('Video duration exceeds limit'),
      confirmBtn: {
        onClick: () => {
          convert({
            storageId,
            mediaType: MEDIA_TYPE.LIVE_PHOTO,
            source
          });
        }
      }
    };
    const readableDurationLimit =
      sprintf(nl('%d second', '%d seconds', VIDEO_DURATION_LIMIT), VIDEO_DURATION_LIMIT);

    return (
      <div className="file-loader-component fill">
        <Dropzone
          className="dropzone fill container-center-row"
          activeClassName="isDragged"
          ref="dropzone"
          onDrop={this.handleDropFile}
          disableClick={true}
          multiple={false}
          accept={this.acceptTypes}
        >
          <FlatButton
            className="file-loader-btn"
            text={l('Choose File')}
            onClick={this.handleClickBtn}
          />
          <br />
          <p>{l('Or drag & drop your video / panorama anywhere')}</p>
        </Dropzone>
        <Modal {...modalProps}>
          {sprintf(l('Only the first %s will be captured. Still continue?'), readableDurationLimit)}
        </Modal>
      </div>
    );
  }
}

FileLoader.propTypes = propTypes;
FileLoader.defaultProps = defaultProps;

export default FileLoader;
