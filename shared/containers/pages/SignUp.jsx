'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SignUp from 'components/Pages/SignUp';
import { registerUser } from 'actions/user';
import { sendEvent } from 'lib/utils/googleAnalytics';

const propTypes = {
  children: PropTypes.object
};

const defaultProps = {
};

class SignUpPageContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.signUp = this.signUp.bind(this);
  }

  // Wrapper function for dispatching sign up
  signUp(username, email, password, callback) {
    this.props.dispatch(registerUser({
      username,
      email,
      password
    }, callback));
    sendEvent('login page', 'join', 'email');
  }

  render() {
    const { children } = this.props;

    return (
      <SignUp
        signUp={this.signUp}
      >
        {children}
      </SignUp>
    );
  }
}

SignUpPageContainer.propTypes = propTypes;
SignUpPageContainer.defaultProps = defaultProps;

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps)(SignUpPageContainer);
