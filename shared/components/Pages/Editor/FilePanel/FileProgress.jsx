'use strict';

import React, { Component, PropTypes } from 'react';
import { Circle } from 'rc-progress';

if (process.env.BROWSER) {
  require('./FileProgress.css');
}

const COLOR_MAP = [
  '#72C02C',
  '#79D5B3',
  '#3498DB',
  '#9B6BCC'
];

const propTypes = {
  progress: PropTypes.number.isRequired
};

const defaultProps = {
};

class FileProgress extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { progress } = this.props;
    const percent = parseInt(progress * 100, 10);
    const colorIdx = parseInt(progress * COLOR_MAP.length, 10);
    const color = COLOR_MAP[colorIdx];

    return (
      <div className="file-progress-component container-center-row fill">
        <div className="progress-wrapper">
          <Circle
            percent={percent}
            strokeColor={color}
          />
          <p className="progress-text text-center">
            {`${percent}%`}
          </p>
        </div>
      </div>
    );
  }
}

FileProgress.propTypes = propTypes;
FileProgress.defaultProps = defaultProps;

export default FileProgress;
