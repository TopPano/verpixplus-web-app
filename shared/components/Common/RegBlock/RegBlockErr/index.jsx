'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

if (process.env.BROWSER) {
  require('./RegBlockErr.css');
}

const propTypes = {
  errMsg: PropTypes.string.isRequired,
  convertedErrMsgs: PropTypes.object,
  clearErrMsg: PropTypes.func.isRequired
};

const defaultProps = {
  convertedErrMsgs: {}
};

class RegBlockErr extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);

    // Bind "this" to member funcitons
    this.handleClickBtn = this.handleClickBtn.bind(this);
    this.clear = this.clear.bind(this);
  }

  // Parse error message and convert them into human readable message
  convertErrMsg(errMsg, convertedErrMsgs, defaultConvertedErrMsgs) {
    // TODO: Handle for more error message.
    if (!errMsg) {
      return '';
    } else if (errMsg === 'Unauthorized') {
      return (
        convertedErrMsgs[errMsg] ?
        convertedErrMsgs[errMsg] :
        defaultConvertedErrMsgs[errMsg]
      );
    } else {
      return (
        convertedErrMsgs.others ?
        convertedErrMsgs.others :
        defaultConvertedErrMsgs.others
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
    const { l } = this.context.i18n;
    const {
      errMsg,
      convertedErrMsgs
    } = this.props;
    const defaultConvertedErrMsgs = {
      'Existed': l('The email address already exists'),
      'Unauthorized': l('The email and password don\'t match'),
      'others': l('Something wrong with server, please try again later')
    };
    const componentClass = classNames({
      'reg-block-err-component': true,
      'hide': !Boolean(errMsg)
    });
    const convertedErrMsg = this.convertErrMsg(errMsg, convertedErrMsgs, defaultConvertedErrMsgs);

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
