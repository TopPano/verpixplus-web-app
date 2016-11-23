'use strict';

import React, { Component, PropTypes } from 'react';

import FileLoader from './FileLoader';
import FileProgress from './FileProgress';

if (process.env.BROWSER) {
  require('./FilePanel.css');
}

const propTypes = {
  storageId: PropTypes.string.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  convert: PropTypes.func.isRequired
};

const defaultProps = {
};

class FilePanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      storageId,
      isProcessing,
      progress,
      convert
    } = this.props;

    return (
      <div className="file-panel-component fill">
        {
          isProcessing ?
          <FileProgress
            progress={progress}
          /> :
          <FileLoader
            storageId={storageId}
            convert={convert}
          />
        }
      </div>
    );
  }
}

FilePanel.propTypes = propTypes;
FilePanel.defaultProps = defaultProps;

export default FilePanel;
