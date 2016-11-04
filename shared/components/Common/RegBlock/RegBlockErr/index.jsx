'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import DEFAULT_CONTENT from 'content/sign/en-us.json';

const DEFAULT_CONVERTED_ERR_MSGS = DEFAULT_CONTENT.ERR_MSG;

if (process.env.BROWSER) {
  require('./RegBlockErr.css');
}

const propTypes = {
  errMsg: PropTypes.string.isRequired,
  convertedErrMsgs: PropTypes.object,
  clearErrMsg: PropTypes.func.isRequired
};

const defaultProps = {
  convertedErrMsgs: DEFAULT_CONVERTED_ERR_MSGS
};

class RegBlockErr extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member funcitons
    this.handleClickBtn = this.handleClickBtn.bind(this);
    this.clear = this.clear.bind(this);
  }

  // Parse error message and convert them into human readable message
  convertErrMsg(errMsg, convertedErrMsgs) {
    // TODO: Handle for more error message.
    if (!errMsg) {
      return '';
    } else if (errMsg === 'Unauthorized') {
      return (
        convertedErrMsgs.AJAX.UNAUTHORIZED ?
        convertedErrMsgs.AJAX.UNAUTHORIZED :
        DEFAULT_CONVERTED_ERR_MSGS.AJAX.UNAUTHORIZED
      );
    } else {
      return (
        convertedErrMsgs.AJAX.OTHERS ?
        convertedErrMsgs.AJAX.OTHERS :
        DEFAULT_CONVERTED_ERR_MSGS.AJAX.OTHERS
      );
    }
  }

  // Clear error message
  clear() {
    this.props.clearErrMsg();
  }

  // Handler for click button
  handleClickBtn() {
    this.clear();
  }

  // TODO: show/hide block with animation
  render() {
    const {
      errMsg,
      convertedErrMsgs
    } = this.props;
    const componentClass = classNames({
      'reg-block-err-component': true,
      'hide': !Boolean(errMsg)
    });
    const convertedErrMsg = this.convertErrMsg(errMsg, convertedErrMsgs);

    return (
      <div className={componentClass}>
        <div className="alert alert-danger fade in alert-dismissable">
          <button
            type="button"
            className="close"
            onClick={this.handleClickBtn}
          >
            &times;
          </button>
          <strong>{convertedErrMsg}</strong>
        </div>
      </div>
    );
  }
}

RegBlockErr.propTypes = propTypes;
RegBlockErr.defaultProps = defaultProps;

export default RegBlockErr;
