'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./RegBlockErr.css');
}

const propTypes = {
};

const defaultProps = {
};

class RegBlockErr extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member funcitons
    this.handleClickBtn = this.handleClickBtn.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    // Initialize state
    this.state = {
      isErr: false,
      errMsg: ''
    };
  }

  // Show blocks and change to error mode
  show(errMsg) {
    this.setState({
      isErr: true,
      errMsg
    });
  }

  // Hide blocks and change to normal mode
  hide() {
    this.setState({
      isErr: false,
      errMsg: ''
    });
  }

  // Handler for click button
  handleClickBtn() {
    this.hide();
  }

  // TODO: show/hide block with animation
  render() {
    const { isErr, errMsg } = this.state;

    return (
      <div className="reg-block-err-component">
        {
          isErr &&
          <div className="alert alert-danger fade in alert-dismissable">
            <button
              type="button"
              className="close"
              onClick={this.handleClickBtn}
            >
              &times;
            </button>
            <strong>{errMsg}</strong>
          </div>
        }
      </div>
    );
  }
}

RegBlockErr.propTypes = propTypes;
RegBlockErr.defaultProps = defaultProps;

export default RegBlockErr;
