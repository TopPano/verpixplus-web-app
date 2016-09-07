'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./IconButton.css');
}

const propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string,
  handleClick: PropTypes.func
}

const defaultProps = {
  text: '',
  handleClick: () => {}
}

class IconButton extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    const { icon, text, className } = this.props;

    return (
      <button
        className={className}
        type="button"
      >
        <i className={`fa fa-${icon}`}></i>
        {` ${text}`}
      </button>
    );
  }
}

IconButton.propTypes = propTypes;
IconButton.defaultProps = defaultProps;

export default IconButton;
