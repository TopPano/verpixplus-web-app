'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SignIn from 'components/Pages/SignIn';
import { loginUser } from 'actions/user';
import { sendEvent } from 'lib/utils/googleAnalytics';

const propTypes = {
  children: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
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
  signIn(email, password) {
    this.props.dispatch(loginUser({email, password}));
    sendEvent('login page', 'login', 'email');
  }

  render() {
    return (
      <SignIn
        user={this.props.user}
        signIn={this.signIn}
      />
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

SignInPageContainer.propTypes = propTypes;
SignInPageContainer.defaultProps = defaultProps;

export default connect(mapStateToProps)(SignInPageContainer);
