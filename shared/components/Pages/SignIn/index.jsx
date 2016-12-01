'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import RegBlock from 'components/Common/RegBlock';
import RegBlockHeader from 'components/Common/RegBlock/RegBlockHeader';
import RegBlockInput from 'components/Common/RegBlock/RegBlockInput';
import RegBlockBtn from 'components/Common/RegBlock/RegBlockBtn';
import RegBlockErr from 'components/Common/RegBlock/RegBlockErr';
import {
  checkEmail,
  checkPwd
} from 'components/Common/RegBlock/inputUtils';

if (process.env.BROWSER) {
  require('./SignIn.css');
}

const propTypes = {
  errMsg: PropTypes.string.isRequired,
  signIn: PropTypes.func.isRequired,
  clearErrMsg: PropTypes.func.isRequired
};

const defaultProps = {
};

class SignIn extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.refs.err.clear();
  }

  // Handler for RegBlock submit
  handleSubmit(e) {
    e.preventDefault();

    this.refs.err.clear();

    const { i18n } = this.context;
    const email = this.refs.email;
    const pwd = this.refs.pwd;
    const emailVal = email.getValue().toLowerCase();
    const pwdVal = pwd.getValue();
    const { signIn } = this.props;

    // Check email value
    const emailErr = checkEmail(emailVal, i18n);
    if (emailErr) {
      email.err(emailErr);
      return;
    }
    // Check password value
    const pwdErr = checkPwd(pwdVal, i18n);
    if (pwdErr) {
      pwd.err(pwdErr);
      return;
    }

    signIn(emailVal, pwdVal);
  }

  // Render RegBlockInputs
  renderInputs(props) {
    return props.reduce((pre, cur, idx) => [...pre, <RegBlockInput key={idx} {...cur} />], []);
  }

  render() {
    const { l } = this.context.i18n;
    const { errMsg, clearErrMsg } = this.props;
    const blockProps = {
      handleSubmit: this.handleSubmit
    }
    const headerProps = {
      title: l('Sign In'),
      switchTo: {
        url: '/signup',
        name: l('Sign Up'),
        desc: `${l('Don\'t have an account')}?`
      }
    };
    const errProps = {
      errMsg,
      clearErrMsg,
      ref: 'err'
    };
    const inputsProps = [{
      // TODO: use "email" type instead of "text"
      ref: 'email',
      icon: 'envelope',
      type: 'text',
      placeHolder: l('Email')
    }, {
      ref: 'pwd',
      icon: 'lock',
      type: 'password',
      placeHolder: l('Password'),
      trimValue: false
    }];
    const btnProps = {
      text: l('Sign In')
    };
    const inputs = this.renderInputs(inputsProps);

    return (
      <div className="sign-in-component container-fullpage">
        <RegBlock {...blockProps} >
          <RegBlockHeader {...headerProps} />
          <RegBlockErr {...errProps} />
          {inputs}
          <p className="forgot-pwd">
            <Link
              className="pull-right"
              to="/pwd/reset/request"
            >
              {`${l('Forgot Password')}?`}
            </Link>
          </p>
          <hr />
          <RegBlockBtn {...btnProps} />
        </RegBlock>
      </div>
    );
  }
}

SignIn.propTypes = propTypes;
SignIn.defaultProps = defaultProps;

export default SignIn;
