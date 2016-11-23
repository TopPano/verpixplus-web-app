'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SignIn from 'components/Pages/SignIn';
import { connectDataFetchers } from 'lib/utils';
import { loginUser, clearUserErrMsg } from 'actions/user';
import { sendEvent } from 'lib/utils/googleAnalytics';

const propTypes = {
  errMsg: PropTypes.string.isRequired,
  children: PropTypes.object
};

const defaultProps = {
};

class SignInPageContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.signIn = this.signIn.bind(this);
    this.clearErrMsg = this.clearErrMsg.bind(this);
  }

  // Wrapper function for dispatching sign in
  signIn(email, password) {
    this.props.dispatch(loginUser({
      email,
      password
    }));
    sendEvent('signin page', 'signin', 'email');
  }

  // Wrapper function for dispatching clear error message
  clearErrMsg() {
    this.props.dispatch(clearUserErrMsg());
  }

  render() {
    const { errMsg, children } = this.props;

    return (
      <SignIn
        errMsg={errMsg}
        signIn={this.signIn}
        clearErrMsg={this.clearErrMsg}
      >
        {children}
      </SignIn>
    );
  }
}

SignInPageContainer.propTypes = propTypes;
SignInPageContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { errMsg } = state.user;

  return {
    errMsg
  };
}

export default connect(mapStateToProps)(
  connectDataFetchers(SignInPageContainer, [])
);
