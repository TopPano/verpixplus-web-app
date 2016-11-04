'use strict';

import React, { Component, PropTypes } from 'react';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'is-empty';

import CONTENT from 'content/sign/en-us.json';
import { RESET_PWD_MODE } from 'constants/resetPwd';
import RegBlock from 'components/Common/RegBlock';
import RegBlockHeader from 'components/Common/RegBlock/RegBlockHeader';
import RegBlockInput from 'components/Common/RegBlock/RegBlockInput';
import RegBlockBtn from 'components/Common/RegBlock/RegBlockBtn';
import RegBlockErr from 'components/Common/RegBlock/RegBlockErr';

const { ERR_MSG } = CONTENT;

if (process.env.BROWSER) {
  require('./ResetPwd.css');
}

const propTypes = {
  mode: PropTypes.string.isRequired,
  errMsg: PropTypes.string.isRequired,
  resetPassword: PropTypes.func.isRequired,
  clearErrMsg: PropTypes.func.isRequired
};

const defaultProps = {
};

class ResetPwd extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Handler for RegBlock submit
  handleSubmit(e) {
    e.preventDefault();

    this.refs.err.clear();

    const { resetPassword } = this.props;
    const email = this.refs.email;
    const emailVal = email.getValue();

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

    resetPassword({
      email: emailVal
    });
  }

  render() {
    const {
      mode,
      errMsg,
      clearErrMsg
    } = this.props;
    const blockProps = {
      handleSubmit: this.handleSubmit
    }
    const headerProps = {
      title: CONTENT.HEADER.RESET_PWD.TITLE,
      switchTo: {
        desc:
          mode === RESET_PWD_MODE.REQUEST ?
          CONTENT.HEADER.RESET_PWD.SWITCH_TO.DESC :
          ''
      }
    };
    const errProps = {
      errMsg,
      clearErrMsg,
      ref: 'err'
    };
    const emailProps = {
      // TODO: use "email" type instead of "text"
      ref: 'email',
      icon: 'envelope',
      type: 'text',
      placeHolder: CONTENT.INPUTS.EMAIL
    };
    const btnProps = {
      text: CONTENT.BTN.RESET_PWD.TEXT
    };

    return (
      <div className="reset-pwd-component container-fullpage">
        <RegBlock {...blockProps} >
          <RegBlockHeader {...headerProps} />
          <RegBlockErr {...errProps} />
          {
            mode === RESET_PWD_MODE.REQUEST &&
            <RegBlockInput {...emailProps} />
          }
          {
            mode === RESET_PWD_MODE.SENT &&
            <p className="text-center">{CONTENT.OTHERS.RESET_PWD.SENT}</p>
          }
          {
            mode === RESET_PWD_MODE.DONE &&
            <p className="text-center">{CONTENT.OTHERS.RESET_PWD.DONE}</p>
          }
          <hr />
          {
            mode === RESET_PWD_MODE.REQUEST &&
            <RegBlockBtn {...btnProps} />
          }
        </RegBlock>
      </div>
    );
  }
}

ResetPwd.propTypes = propTypes;
ResetPwd.defaultProps = defaultProps;

export default ResetPwd;
