'use strict';

import React, { Component, PropTypes } from 'react';

import { RESET_PWD_MODE } from 'constants/resetPwd';
import RegBlock from 'components/Common/RegBlock';
import RegBlockHeader from 'components/Common/RegBlock/RegBlockHeader';
import RegBlockInput from 'components/Common/RegBlock/RegBlockInput';
import RegBlockBtn from 'components/Common/RegBlock/RegBlockBtn';
import RegBlockErr from 'components/Common/RegBlock/RegBlockErr';
import { checkEmail } from 'components/Common/RegBlock/inputUtils';

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
    const { resetPassword } = this.props;
    const email = this.refs.email;
    const emailVal = email.getValue().toLowerCase();

    // Check email value
    const emailErr = checkEmail(emailVal, i18n);
    if (emailErr) {
      email.err(emailErr);
      return;
    }

    resetPassword({
      email: emailVal
    });
  }

  render() {
    const { l } = this.context.i18n;
    const {
      mode,
      errMsg,
      clearErrMsg
    } = this.props;
    const blockProps = {
      handleSubmit: this.handleSubmit
    }
    const headerProps = {
      title: l('Reset Password'),
      switchTo: {
        desc:
          mode === RESET_PWD_MODE.REQUEST ?
          l('Plese provide the email address linked to your account') :
          ''
      }
    };
    const errProps = {
      errMsg,
      clearErrMsg,
      convertedErrMsgs: {
        EMAIL_NOT_FOUND: 'The email address is not registered'
      },
      ref: 'err'
    };
    const emailProps = {
      // TODO: use "email" type instead of "text"
      ref: 'email',
      icon: 'envelope',
      type: 'text',
      placeHolder: l('Email')
    };
    const btnProps = {
      text: l('Reset Password')
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
            <p className="text-center">{l('Thanks! Please check your email box for following process')}</p>
          }
          {
            mode === RESET_PWD_MODE.DONE &&
            <p className="text-center">{l('A new password is sent to your email. Please check your email box, thanks')}</p>
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
