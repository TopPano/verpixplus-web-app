'use strict';

import React, { Component, PropTypes } from 'react';

import InfoPanel from 'containers/common/InfoPanel';
import Brand from './Brand';

if (process.env.BROWSER) {
  require('./Header.css');
}

const propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

const defaultProps = {
};

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isAuthenticated } = this.props;

    return (
      <div className='header-component container-center-row'>
        <Brand isAuthenticated={isAuthenticated} />
        <InfoPanel />
      </div>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
