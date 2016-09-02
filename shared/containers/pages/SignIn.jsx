'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SignIn from 'components/Pages/SignIn';
import { loginUser } from 'actions/user';
import { sendEvent } from 'lib/utils/googleAnalytics';

const propTypes = {
  children: PropTypes.object
};

const defaultProps = {
};

class SignInPageContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.signIn = this.signIn.bind(this);
  }

  // Wrapper function for dispatching sign in
  signIn(email, password, callback) {
    this.props.dispatch(loginUser({
      email,
      password
    }, callback));
    sendEvent('login page', 'login', 'email');
  }

  render() {
    const { children } = this.props;

    return (
      <SignIn
        signIn={this.signIn}
      >
        {children}
      </SignIn>
    );
  }
}

SignInPageContainer.propTypes = propTypes;
SignInPageContainer.defaultProps = defaultProps;

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps)(SignInPageContainer);
