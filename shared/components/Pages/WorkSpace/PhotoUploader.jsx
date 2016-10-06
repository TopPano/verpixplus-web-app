'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./PhotoUploader.css');
}

const propTypes = {
};

const defaultProps = {
};

class PhotoUploader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <img className='photo-uploader-component'
        src='/static/images/workspace/workspace-profile-upload.png'
        alt='upload'
      />
    );
  }
}

PhotoUploader.propTypes = propTypes;
PhotoUploader.defaultProps = defaultProps;

export default PhotoUploader;
