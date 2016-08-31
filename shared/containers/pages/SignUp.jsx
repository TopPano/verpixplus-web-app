'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SignIn from 'components/Pages/SignIn';
import { loginUser, facebookTokenLogin, registerUser, resetErrMsg } from 'actions/user';

import { sendEvent } from 'lib/utils/googleAnalytics';

class SignInPageContainer extends Component {
  static propTyes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

  login = (email, password) => {
    this.props.dispatch(loginUser({email, password}));
    sendEvent('login page', 'login', 'email');
  }

  facebookLogin = (token) => {
    this.props.dispatch(facebookTokenLogin(token));
    sendEvent('login page', 'login', 'facebook');
  }

  join = (username, email, password) => {
    this.props.dispatch(registerUser({username, email, password}));
    sendEvent('login page', 'join', 'email');
  }

  cleanErrMsg = () => {
    this.props.dispatch(resetErrMsg());
  }

  render() {
    return (
      <SignIn
        user={this.props.user}
        loginUser={this.login}
        facebookLogin={this.facebookLogin}
        joinUser={this.join}
        cleanErrMsg={this.cleanErrMsg}
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

export default connect(mapStateToProps)(SignInPageContainer);
