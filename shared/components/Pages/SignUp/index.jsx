'use strict';

import React, { Component, PropTypes } from 'react';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'is-empty';

import { EXTERNAL_LINKS } from 'constants/common';
import CONTENT from 'content/sign/en-us.json';
import SITE_CONTENT from 'content/site/en-us.json';

import RegBlock from 'components/Common/RegBlock';
import RegBlockHeader from 'components/Common/RegBlock/RegBlockHeader';
import RegBlockInput from 'components/Common/RegBlock/RegBlockInput';
import RegBlockBtn from 'components/Common/RegBlock/RegBlockBtn';
import RegBlockOthers from 'components/Common/RegBlock/RegBlockOthers';
import RegBlockErr from 'components/Common/RegBlock/RegBlockErr';
import ExternalLink from 'components/Common/ExternalLink';

const { ERR_MSG } = CONTENT;

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
      username.err(ERR_MSG.USERNAME.EMPTY);
      return;
    }
    // Username format validation
    if (!this.isValidName(usernameVal)) {
      username.err(ERR_MSG.USERNAME.INVALID);
      return;
    }
    // Check email is empty or not
    if (isEmpty(emailVal)) {
      email.err(ERR_MSG.EMAIL.EMPTY);
      return;
    }
    // Email format validation
    if (!isEmail(emailVal)) {
      email.err(ERR_MSG.EMAIL.INVALID);
      return;
    }
    // Check password is empty or not
    if (isEmpty(pwdVal)) {
      pwd.err(ERR_MSG.PWD.EMPTY);
      return;
    }
    // Check confirm-password is empty or not
    if (isEmpty(confirmPwdVal)) {
      confirmPwd.err(ERR_MSG.CONFIRM_PWD.EMPTY);
      return;
    }
    // Check equality of password and confirm-password
    if (pwdVal !== confirmPwdVal) {
      pwd.err(ERR_MSG.PWD.NOT_MATCHED);
      return;
    }

    signUp(usernameVal, emailVal, pwdVal);
  }

  // Render RegBlockInputs
  renderInputs(props) {
    return props.reduce((pre, cur, idx) => [...pre, <RegBlockInput key={idx} {...cur} />], []);
  }

  render() {
    const { errMsg, clearErrMsg } = this.props;
    const blockProps = {
      handleSubmit: this.handleSubmit
    }
    const headerProps = {
      title: CONTENT.HEADER.SIGN_UP.TITLE,
      switchTo: {
        url: '/signin',
        name: CONTENT.HEADER.SIGN_UP.SWITCH_TO.NAME,
        desc: CONTENT.HEADER.SIGN_UP.SWITCH_TO.DESC
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
      placeHolder: CONTENT.INPUTS.USERNAME
    }, {
      // TODO: use "email" type instead of "text"
      ref: 'email',
      icon: 'envelope',
      type: 'text',
      placeHolder: CONTENT.INPUTS.EMAIL
    }, {
      ref: 'pwd',
      icon: 'lock',
      type: 'password',
      placeHolder: CONTENT.INPUTS.PWD
    }, {
      ref: 'confirmPwd',
      icon: 'key',
      type: 'password',
      placeHolder: CONTENT.INPUTS.CONFIRM_PWD
    }];
    const btnProps = {
      text: CONTENT.BTN.SIGN_UP.TEXT
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
            {CONTENT.OTHERS.SIGN_UP.AGREE}
            <ExternalLink to={EXTERNAL_LINKS.TERMS_OF_USE}>
             {SITE_CONTENT.FOOTER.TERMS_OF_USE}
            </ExternalLink>
            {CONTENT.OTHERS.SIGN_UP.AND}
            <ExternalLink to={EXTERNAL_LINKS.PRIVACY_POLICY}>
             {SITE_CONTENT.FOOTER.PRIVACY_POLICY}
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
