'use strict';

import React, { Component } from 'react';

import InfoPanel from 'components/Common/InfoPanel';
import Brand from './Brand';

if (process.env.BROWSER) {
  require('./Header.css');
}

const propTypes = {
};

const defaultProps = {
};

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='header-component container-center-row'>
        <Brand />
        <InfoPanel />
      </div>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
