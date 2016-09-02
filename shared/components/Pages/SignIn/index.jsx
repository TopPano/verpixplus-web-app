'use strict';

import React, { Component, PropTypes } from 'react';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'is-empty';

import CONTENT from 'content/sign/en-us.json';
import RegBlock from 'components/Common/RegBlock';
import RegBlockHeader from 'components/Common/RegBlock/RegBlockHeader';
import RegBlockInput from 'components/Common/RegBlock/RegBlockInput';
import RegBlockBtn from 'components/Common/RegBlock/RegBlockBtn';
import RegBlockErr from 'components/Common/RegBlock/RegBlockErr';

const { ERR_MSG } = CONTENT;

if (process.env.BROWSER) {
  require('./SignIn.css');
}

const propTypes = {
  signIn: PropTypes.func.isRequired
};

const defaultProps = {
};

class SignIn extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitErr = this.handleSubmitErr.bind(this);
  }

  // Handler for response error from remote server
  handleSubmitErr(err) {
    if (err && err.message) {
      const errBlock = this.refs.err;

      // TODO: Handle for more error message.
      if (err.message === 'Unauthorized') {
        errBlock.show(ERR_MSG.AJAX.UNAUTHORIZED);
      } else {
        errBlock.show(ERR_MSG.AJAX.OTHERS);
      }
    }
  }

  // Handler for RegBlock submit
  handleSubmit(e) {
    e.preventDefault();

    this.refs.err.hide();

    const email = this.refs.email;
    const pwd = this.refs.pwd;
    const emailVal = email.getValue();
    const pwdVal = pwd.getValue();
    const { signIn } = this.props;

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

    signIn(emailVal, pwdVal, this.handleSubmitErr);
  }

  // Render RegBlockInputs
  renderInputs(props) {
    return props.reduce((pre, cur, idx) => [...pre, <RegBlockInput key={idx} {...cur} />], []);
  }

  render() {
    const blockProps = {
      handleSubmit: this.handleSubmit
    }
    const headerProps = {
      title: CONTENT.HEADER.SIGN_IN.TITLE,
      switchTo: {
        url: '/signup',
        name: CONTENT.HEADER.SIGN_IN.SWITCH_TO.NAME,
        desc: CONTENT.HEADER.SIGN_IN.SWITCH_TO.DESC
      }
    };
    const errProps = {
      ref: 'err'
    };
    const inputsProps = [{
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
    }];
    const btnProps = {
      text: CONTENT.BTN.SIGN_IN.TEXT
    };
    const inputs = this.renderInputs(inputsProps);

    return (
      <div className="sign-in-component">
        <RegBlock {...blockProps} >
          <RegBlockHeader {...headerProps} />
          <RegBlockErr {...errProps} />
          {inputs}
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
