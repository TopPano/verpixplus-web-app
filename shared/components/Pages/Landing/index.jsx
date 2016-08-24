'use strict';

import React, { Component } from 'react';
if (process.env.BROWSER) {
  require('./Landing.css');
}

export default class Landing extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='landing-component'>
      </div>
    );
  }
}

Landing.displayName = 'Landing';
