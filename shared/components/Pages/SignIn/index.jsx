'use strict';

import React, { Component, PropTypes } from 'react';

import CONTENT from 'content/sign/en-us.json';
import RegBlock from 'components/Common/RegBlock';
import RegBlockHeader from 'components/Common/RegBlock/RegBlockHeader';
import RegBlockInput from 'components/Common/RegBlock/RegBlockInput';
import RegBlockBtn from 'components/Common/RegBlock/RegBlockBtn';

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
    this.handleClick = this.handleClick.bind(this);
  }

  // Handler for click RegBlockBtn
  handleClick(e) {
    e.preventDefault();

    const emailVal = this.refs.email.getValue();
    const pwdVal = this.refs.pwd.getValue();
    const { signIn } = this.props;
    // TODO: Input values validation
    
    signIn(emailVal, pwdVal);
  }

  // Render RegBlockInputs
  renderInputs(props) {
    return props.reduce((pre, cur) => [...pre, <RegBlockInput {...cur} />], []);
  }

  render() {
    const headerProps = {
      title: CONTENT.HEADER.SIGN_IN.TITLE,
      switchTo: {
        url: '/signup',
        name: CONTENT.HEADER.SIGN_IN.SWITCH_TO.NAME,
        desc: CONTENT.HEADER.SIGN_IN.SWITCH_TO.DESC
      }
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
      handleClick: this.handleClick
    };
    const inputs = this.renderInputs(inputsProps);

    return (
      <div className="sign-in-component">
        <RegBlock>
          <RegBlockHeader {...headerProps} />
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