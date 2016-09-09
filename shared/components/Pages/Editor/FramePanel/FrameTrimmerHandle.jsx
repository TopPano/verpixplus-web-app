'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./FrameTrimmerHandle.css');
}

const propTypes = {
};

const defaultProps = {
};

class FrameTrimmerhandle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { value, offset } = this.props;
    const style = {
      left: `${offset}%`
    };

    return (
      <div
        className="rc-slider-handle frame-trimmer-handle-component"
        style={style}
      >
        <strong className="handle-value">
          {value}
        </strong>
      </div>
    );
  }
}

FrameTrimmerhandle.propTypes = propTypes;
FrameTrimmerhandle.defaultProps = defaultProps;

export default FrameTrimmerhandle;
