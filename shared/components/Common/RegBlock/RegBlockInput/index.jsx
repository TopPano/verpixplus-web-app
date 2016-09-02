'use strict';

import React, { Component, PropTypes } from 'react';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import trim from 'lodash/trim';
import classNames from 'classnames';

if (process.env.BROWSER) {
  require('./RegBlockInput.css');
}

const propTypes = {
  icon: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeHolder: PropTypes.string
};

const defaultProps = {
  placeHolder: ''
};

class RegBlockInput extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.getValue = this.getValue.bind(this);
    this.err = this.err.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFocusout = this.handleFocusout.bind(this);

    // Initialize state
    this.state = {
      inputValue: '',
      isErr: false,
      errMsg: ''
    };
  }

  // Get value of input
  getValue() {
    return trim(this.refs.input.value);
  }

  // Change to Error mode
  err(errMsg) {
    this.setState({
      isErr: true,
      errMsg
    });
    this.refs.input.focus();
  }

  // Handler for input changes
  handleInputChange() {
    this.setState({
      inputValue: trim(this.refs.input.value),
      isErr: false,
      errMsg: ''
    });
  }

  // Handler for input focus out
  handleFocusout() {
    if (this.state.isErr) {
      this.setState({
        isErr: false,
        errMsg: ''
      });
    }
  }

  render() {
    const { icon, type, placeHolder } = this.props;
    const { inputValue, isErr, errMsg } = this.state;
    const inputClass = classNames({
      'form-control': true,
      'err': isErr
    });
    const tooltipClass = classNames({
      // TODO: show/hide tooltip with animation
      'hidden': !isErr
    });
    const tooltip =
      <Tooltip
        id="inputTooltip"
        className={tooltipClass}
      >
        {errMsg}
      </Tooltip>;

    return (
      <div className="reg-block-input-component input-group margin-bottom-20">
        <span className="input-group-addon">
          <i className={`fa fa-${icon}`} />
        </span>
        <OverlayTrigger
          placement="bottom"
          overlay={tooltip}
          trigger={['focus']}
        >
          <input
            ref="input"
            type={type}
            className={inputClass}
            placeholder={placeHolder}
            onChange={this.handleInputChange}
            onBlur={this.handleFocusout}
            value={inputValue}
          />
        </OverlayTrigger>
      </div>
    );
  }
}

RegBlockInput.propTypes = propTypes;
RegBlockInput.defaultProps = defaultProps;

export default RegBlockInput;
