'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Preview.css');
}

const propTypes = {
  images: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

const defaultProps = {
};

class Preview extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { images } = this.props;
    return(
      <div className="preview-component">
      </div>
    );
  }
}

Preview.propTypes = propTypes;
Preview.defaultProps = defaultProps;

export default Preview;
