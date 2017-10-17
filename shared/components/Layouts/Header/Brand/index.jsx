'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('./Brand.css');
}

const propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

const defaultProps = {
};

class Brand extends Component {
  render() {
    const { isAuthenticated } = this.props;
    const img =
      <img
        className="svg logo"
        src="/static/images/header/logo.svg"
        alt="Verpix"
      />;

    return (
      <div className="brand-component">
        {
          isAuthenticated ?
          <Link to="/">
            {img}
          </Link> :
          <a href="/">
            {img}
          </a>
        }
      </div>
    );
  }
}

Brand.propTypes = propTypes
Brand.defaultProps = defaultProps;

export default Brand;
