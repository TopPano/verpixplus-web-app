'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('./Brand.css');
}

export default class Brand extends Component {
  render() {
    return (
      <Link to={'/'} className='brand-component logo'>
        <img
          src='/static/images/header/logo.png'
          alt='Verpix Plus'
        />
      </Link>
    );
  }
}

Brand.displayName = 'Brand';

Brand.propTypes = {
};
Brand.defaultProps = {
};
