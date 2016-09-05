'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SignUp from 'components/Pages/SignUp';
import { registerUser, clearUserErrMsg } from 'actions/user';
import { sendEvent } from 'lib/utils/googleAnalytics';

const propTypes = {
  errMsg: PropTypes.string.isRequired,
  children: PropTypes.object
};

const defaultProps = {
};

class SignUpPageContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.signUp = this.signUp.bind(this);
    this.clearErrMsg = this.clearErrMsg.bind(this);
  }

  // Wrapper function for dispatching sign up
  signUp(username, email, password) {
    this.props.dispatch(registerUser({
      username,
      email,
      password
    }));
    sendEvent('signup page', 'signup', 'email');
  }

  // Wrapper function for dispatching clear error message
  clearErrMsg() {
    this.props.dispatch(clearUserErrMsg());
  }

  render() {
    const { errMsg, children } = this.props;

    return (
      <SignUp
        errMsg={errMsg}
        signUp={this.signUp}
        clearErrMsg={this.clearErrMsg}
      >
        {children}
      </SignUp>
    );
  }
}

SignUpPageContainer.propTypes = propTypes;
SignUpPageContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { errMsg } = state.user;

  return {
    errMsg
  };
}

export default connect(mapStateToProps)(SignUpPageContainer);
