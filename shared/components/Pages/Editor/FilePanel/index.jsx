'use strict';

import React, { Component, PropTypes } from 'react';

import FileLoader from './FileLoader';
import FileProgress from './FileProgress';

if (process.env.BROWSER) {
  require('./FilePanel.css');
}

const propTypes = {
  isProcessing: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  convertFile: PropTypes.func.isRequired
};

const defaultProps = {
};

class FilePanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      isProcessing,
      progress,
      convertFile
    } = this.props;

    return (
      <div className="file-panel-component bg-color-light fill">
        {
          isProcessing ?
          <FileProgress
            progress={progress}
          /> :
          <FileLoader convertFile={convertFile} />
        }
      </div>
    );
  }
}

FilePanel.propTypes = propTypes;
FilePanel.defaultProps = defaultProps;

export default FilePanel;
