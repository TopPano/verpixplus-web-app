'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import ERR from 'constants/err';

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
    const { l } = this.context.i18n;

    if (!errMsg) {
      return '';
    }
    if (convertedErrMsgs[errMsg]) {
      return l(convertedErrMsgs[errMsg]);
    }
    if (defaultConvertedErrMsgs[errMsg]) {
      return l(defaultConvertedErrMsgs[errMsg]);
    }
    if (convertedErrMsgs.FETCH_DEFAULT) {
      return `${l(convertedErrMsgs.FETCH_DEFAULT)}: ${errMsg}`;
    }
    return `${l(defaultConvertedErrMsgs.FETCH_DEFAULT)}: ${errMsg}`;
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
    const convertedErrMsg = this.convertErrMsg(errMsg, convertedErrMsgs, ERR);

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
