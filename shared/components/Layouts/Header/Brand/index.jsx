'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('./Brand.css');
}

const propTypes = {
};

const defaultProps = {
};

class Brand extends Component {
  render() {
    return (
      <Link
        to="/"
        className="brand-component"
      >
        <img
          className="svg logo"
          src="/static/images/header/logo.svg"
          alt="Verpix"
        />
      </Link>
    );
  }
}

Brand.propTypes = propTypes
Brand.defaultProps = defaultProps;

export default Brand;
