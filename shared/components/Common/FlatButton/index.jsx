'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

if (process.env.BROWSER) {
  require('./FlatButton.css');
}

const propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}

const defaultProps = {
  text: '',
  disabled: false,
  className: '',
  onClick: () => {}
}

class FlatButton extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to memeber functions
    this.handleClick = this.handleClick.bind(this);
  }

  // Handler for clicking
  handleClick() {
    const {
      disabled,
      onClick
    } = this.props;

    if (!disabled) {
      onClick();
    }
  }

  render() {
    const {
      text,
      disabled,
      className
    } = this.props;
    const componentClass = classNames({
      'flat-button-component clickable text-center': true,
      [className]: true,
      'disabled': disabled
    });

    return (
      <div
        className={componentClass}
        onClick={this.handleClick}
      >
        {text}
      </div>
    );
  }
}

FlatButton.propTypes = propTypes;
FlatButton.defaultProps = defaultProps;

export default FlatButton;
