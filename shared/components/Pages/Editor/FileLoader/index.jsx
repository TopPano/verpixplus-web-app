'use strict';

import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import startsWith from 'lodash/startsWith';

import { ACCEPT_TYPES } from 'constants/editor';
import CONTENT from 'content/editor/en-us.json';

if (process.env.BROWSER) {
  require('./FileLoader.css');
}

const propTypes = {
};

const defaultProps = {
};

class FileLoader extends Component {
  constructor(props) {
    super(props);
    // Bind "this" to callback functions
    this.handleDropFile = this.handleDropFile.bind(this);
    this.handleClickBtn = this.handleClickBtn.bind(this);
    // Accepted MIME types for dropzone
    // TODO: Support for more image and video types
    this.acceptTypes = '';
    this.acceptTypes += ACCEPT_TYPES.IMAGE.reduce((pre, cur) => pre + `image/${cur},`, '');
    this.acceptTypes += ACCEPT_TYPES.VIDEO.reduce((pre, cur) => pre + `video/${cur},`, '');
  }

  // Handler for the file is dropped to zone
  handleDropFile(files) {
    // We limit user only can choose one file
    const file = files[0];

    if (startsWith(file.type, 'image')) {
      // TODO: Handle image (panophoto)
    } else {
      // Handle video (livephoto)
    }
  }

  // Handler for button is click, to choose file
  handleClickBtn() {
    this.refs.dropzone.open();
  }

  render() {
    return (
      <div className="file-loader-component fill">
        <Dropzone
          className="dropzone fill container-center-row"
          ref="dropzone"
          onDrop={this.handleDropFile}
          disableClick={true}
          multiple={false}
          accept={this.acceptTypes}
        >
          <button
            className="btn-u"
            type="button"
            onClick={this.handleClickBtn}
          >
            {CONTENT.FILE_LOADER.BTN}
          </button>
          <br />
          <p>{CONTENT.FILE_LOADER.DESC}</p>
        </Dropzone>
      </div>
    );
  }
}

FileLoader.propTypes = propTypes;
FileLoader.defaultProps = defaultProps;

export default FileLoader;
