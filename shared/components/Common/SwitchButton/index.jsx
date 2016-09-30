'use strict';

import React, { Component } from 'react';
import Switch from 'rc-switch';

if (process.env.BROWSER) {
  require('rc-switch/assets/index.css');
}

const propTypes = {
};

const defaultProps = {
};

class SwitchButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch {...this.props} />
    );
  }
}

SwitchButton.propTypes = propTypes;
SwitchButton.defaultProps = defaultProps;

export default SwitchButton;
