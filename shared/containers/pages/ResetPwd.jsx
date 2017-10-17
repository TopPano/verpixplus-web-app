'use strict';

import React, { Component, PropTypes } from 'react';
import startsWith from 'lodash/startsWith';
import { connect } from 'react-redux';

import { RESET_PWD_MODE } from 'constants/resetPwd';
import ResetPwd from 'components/Pages/ResetPwd';
import {
  resetPassword,
  clearUserErrMsg
} from 'actions/user';

const propTypes = {
  errMsg: PropTypes.string.isRequired,
  children: PropTypes.object
};

const defaultProps = {
};

class ResetPwdPageContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.resetPassword = this.resetPassword.bind(this);
    this.clearErrMsg = this.clearErrMsg.bind(this);
  }

  // Wrapper function for dispatching resetPassword,
  // which resets the password of user
  resetPassword(params) {
    this.props.dispatch(resetPassword(params));
  }

  // Wrapper function for dispatching clearUserErrMsg,
  // which clears the error message about user
  clearErrMsg() {
    this.props.dispatch(clearUserErrMsg());
  }

  render() {
    const {
      errMsg,
      location
    } = this.props;
    let mode = '';

    if (startsWith(location.pathname, '/pwd/reset/request')) {
      mode = RESET_PWD_MODE.REQUEST
    } else if (startsWith(location.pathname, '/pwd/reset/sent')) {
      mode = RESET_PWD_MODE.SENT
    } else if (startsWith(location.pathname, '/pwd/reset/done')) {
      mode = RESET_PWD_MODE.DONE
    } else {
      // TODO: Handling for others
    }

    return (
      <ResetPwd
        mode={mode}
        errMsg={errMsg}
        resetPassword={this.resetPassword}
        clearErrMsg={this.clearErrMsg}
      />
    );
  }
}

ResetPwdPageContainer.propTypes = propTypes;
ResetPwdPageContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { errMsg } = state.user;

  return {
    errMsg
  };
}

export default connect(mapStateToProps)(ResetPwdPageContainer);
