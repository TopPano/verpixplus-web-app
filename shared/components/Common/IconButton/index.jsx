'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./IconButton.css');
}

const propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func
}

const defaultProps = {
  text: '',
  disabled: false,
  className: '',
  handleClick: () => {}
}

class IconButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      icon,
      text,
      disabled,
      className,
      handleClick
    } = this.props;
    const componentClass = 'icon-button-component ' + className;

    return (
      <button
        className={componentClass}
        type="button"
        disabled={disabled}
        onClick={handleClick}
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
