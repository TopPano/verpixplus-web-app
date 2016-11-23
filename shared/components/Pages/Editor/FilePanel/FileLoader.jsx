'use strict';

import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import startsWith from 'lodash/startsWith';
import isArray from 'lodash/isArray';

import { ACCEPT_TYPES } from 'constants/editor';
import { MEDIA_TYPE } from 'constants/common';
import FlatButton from 'components/Common/FlatButton';

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
    this.handleDropFile = this.handleDropFile.bind(this);
    this.handleClickBtn = this.handleClickBtn.bind(this);

    // Accepted MIME types for dropzone
    // TODO:
    // 1. Support image (panophoto)
    // 2. Support for more image and video types
    this.acceptTypes = '';
    // this.acceptTypes += ACCEPT_TYPES.IMAGE.reduce((pre, cur) => pre + `image/${cur},`, '');
    this.acceptTypes += ACCEPT_TYPES.VIDEO.reduce((pre, cur) => pre + `video/${cur},`, '');
  }

  // Handler for the file is dropped to zone
  handleDropFile(files) {
    if (isArray(files) && files[0]) {
      // We limit user only can choose one file
      const file = files[0];
      const {
        storageId,
        convert
      } = this.props

      if (startsWith(file.type, 'image')) {
        // TODO: Handle image (panophoto)
      } else {
        // Handle video (livephoto)
        convert({
          storageId,
          mediaType: MEDIA_TYPE.LIVE_PHOTO,
          source: file.preview
        });
      }
    }
  }

  // Handler for button is click, to choose file
  handleClickBtn() {
    this.refs.dropzone.open();
  }

  render() {
    const { l } = this.context.i18n;

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
          <p>{l('Or drag & drop your video anywhere')}</p>
        </Dropzone>
      </div>
    );
  }
}

FileLoader.propTypes = propTypes;
FileLoader.defaultProps = defaultProps;

export default FileLoader;
