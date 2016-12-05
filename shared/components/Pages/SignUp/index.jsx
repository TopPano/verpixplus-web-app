'use strict';

import React, { Component, PropTypes } from 'react';

import RegBlock from 'components/Common/RegBlock';
import RegBlockHeader from 'components/Common/RegBlock/RegBlockHeader';
import RegBlockInput from 'components/Common/RegBlock/RegBlockInput';
import RegBlockBtn from 'components/Common/RegBlock/RegBlockBtn';
import RegBlockOthers from 'components/Common/RegBlock/RegBlockOthers';
import RegBlockErr from 'components/Common/RegBlock/RegBlockErr';
import ExternalLink from 'components/Common/ExternalLink';
import {
  checkUsername,
  checkEmail,
  checkPwdPair
} from 'components/Common/RegBlock/inputUtils';

if (process.env.BROWSER) {
  require('./SignUp.css');
}

const propTypes = {
  errMsg: PropTypes.string.isRequired,
  signUp: PropTypes.func.isRequired,
  clearErrMsg: PropTypes.func.isRequired
};

const defaultProps = {
};

class SignUp extends Component {
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
    const username = this.refs.username;
    const confirmPwd = this.refs.confirmPwd;
    const email = this.refs.email;
    const pwd = this.refs.pwd;
    const usernameVal = username.getValue();
    const emailVal = email.getValue().toLowerCase();
    const pwdVal = pwd.getValue();
    const confirmPwdVal = confirmPwd.getValue();
    const { signUp } = this.props;

    // Check username value
    const usernameErr = checkUsername(usernameVal, i18n);
    if (usernameErr) {
      username.err(usernameErr);
      return;
    }
    // Check email value
    const emailErr = checkEmail(emailVal, i18n);
    if (emailErr) {
      email.err(emailErr);
      return;
    }
    // Check password pair values
    const pwdPairErr = checkPwdPair(pwdVal, confirmPwdVal, i18n)
    if (pwdPairErr.err) {
      if (!pwdPairErr.isConfirm) {
        pwd.err(pwdPairErr.err);
      } else {
        confirmPwd.err(pwdPairErr.err);
      }
      return;
    }

    signUp(usernameVal, emailVal, pwdVal);
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
      title: l('Sign Up'),
      switchTo: {
        url: '/signin',
        name: l('Sign In'),
        desc: `${l('Have an account')}?`
      }
    };
    const errProps = {
      errMsg,
      clearErrMsg,
      ref: 'err'
    };
    const inputsProps = [{
      ref: 'username',
      icon: 'user',
      type: 'text',
      placeHolder: l('Username')
    }, {
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
    }, {
      ref: 'confirmPwd',
      icon: 'key',
      type: 'password',
      placeHolder: l('Confirm Password'),
      trimValue: false
    }];
    const btnProps = {
      text: l('Sign Up')
    };
    const inputs = this.renderInputs(inputsProps);

    return (
      <div className="sign-up-component container-fullpage">
        <RegBlock {...blockProps} >
          <RegBlockHeader {...headerProps} />
          <RegBlockErr {...errProps} />
          {inputs}
          <hr />
          <RegBlockOthers>
            {`${l('By signing up, you agree to our')} `}
            <ExternalLink to="/terms">
              {l('Terms of Use')}
            </ExternalLink>
            {` ${l('and')} `}
            <ExternalLink to="/privacy">
              {l('Privacy Policy')}
            </ExternalLink>
          </RegBlockOthers>
          <RegBlockBtn {...btnProps} />
        </RegBlock>
      </div>
    );
  }
}

SignUp.propTypes = propTypes;
SignUp.defaultProps = defaultProps;

export default SignUp;
