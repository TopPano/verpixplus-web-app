'use strict';

import React, { Component, PropTypes } from 'react';
import trim from 'lodash/trim';

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
    this.handleInputChange = this.handleInputChange.bind(this);

    // Initialize state
    this.state = {
      inputValue: ''
    };
  }

  // Get value of input
  getValue() {
    return trim(this.refs.input.value);
  }

  // Handler for input changes
  handleInputChange() {
    this.setState({
      inputValue: trim(this.refs.input.value)
    });
  }

  render() {
    const { icon, type, placeHolder } = this.props;
    const { inputValue } = this.state;

    return (
      <div className="reg-block-input-component input-group margin-bottom-20">
        <span className="input-group-addon">
          <i className={`fa fa-${icon}`} />
        </span>
        <input
          ref="input"
          type={type}
          className="form-control"
          placeholder={placeHolder}
          onChange={this.handleInputChange}
          value={inputValue}
        />
      </div>
    );
  }
}

RegBlockInput.propTypes = propTypes;
RegBlockInput.defaultProps = defaultProps;

export default RegBlockInput;
