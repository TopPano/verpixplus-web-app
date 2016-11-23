'use strict';

import React, { Component, PropTypes } from 'react';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'is-empty';

import RegBlock from 'components/Common/RegBlock';
import RegBlockHeader from 'components/Common/RegBlock/RegBlockHeader';
import RegBlockInput from 'components/Common/RegBlock/RegBlockInput';
import RegBlockBtn from 'components/Common/RegBlock/RegBlockBtn';
import RegBlockOthers from 'components/Common/RegBlock/RegBlockOthers';
import RegBlockErr from 'components/Common/RegBlock/RegBlockErr';
import ExternalLink from 'components/Common/ExternalLink';

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

  // Username validation
  // TODO: More tests to be robust
  isValidName(name) {
    const regex = new RegExp('[a-z]+((.|_)?[a-z0-9])+'),
          result = regex.exec(name);
    return result && result[0] === name;
  }

  // Handler for RegBlock submit
  handleSubmit(e) {
    e.preventDefault();

    this.refs.err.clear();

    const { l } = this.context.i18n;
    const username = this.refs.username;
    const confirmPwd = this.refs.confirmPwd;
    const email = this.refs.email;
    const pwd = this.refs.pwd;
    const usernameVal = username.getValue();
    const emailVal = email.getValue();
    const pwdVal = pwd.getValue();
    const confirmPwdVal = confirmPwd.getValue();
    const { signUp } = this.props;

    // Check username is empty or not
    if (isEmpty(usernameVal)) {
      username.err(l('Please enter username'));
      return;
    }
    // Username format validation
    if (!this.isValidName(usernameVal)) {
      username.err(l('Please try another username'));
      return;
    }
    // Check email is empty or not
    if (isEmpty(emailVal)) {
      email.err(l('Please enter your email'));
      return;
    }
    // Email format validation
    if (!isEmail(emailVal)) {
      email.err(l('The email address is not valid'));
      return;
    }
    // Check password is empty or not
    if (isEmpty(pwdVal)) {
      pwd.err(l('Please enter your password'));
      return;
    }
    // Check confirm-password is empty or not
    if (isEmpty(confirmPwdVal)) {
      confirmPwd.err(l('Please enter your password again'));
      return;
    }
    // Check equality of password and confirm-password
    if (pwdVal !== confirmPwdVal) {
      pwd.err(l('These passwords don\'t match'));
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
      placeHolder: l('Password')
    }, {
      ref: 'confirmPwd',
      icon: 'key',
      type: 'password',
      placeHolder: l('Confirm Password')
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
