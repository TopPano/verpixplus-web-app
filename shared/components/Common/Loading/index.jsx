'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Loading.css');
}

const propTypes = {
  size: PropTypes.number
};

const defaultProps = {
  size: 84
};

class Loading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { size } = this.props;
    const componentStyle = {
      width: `${size}px`,
      height: `${size}px`
    };

    return (
      <img
        className="loading-component"
        style={componentStyle}
        src="/static/images/loading-default-black.svg"
        alt="loading"
      />
    );
  }
}

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
