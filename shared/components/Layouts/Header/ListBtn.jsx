'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./ListBtn.css');
}

export default class ListBtn extends Component {
  render() {
    return (
      <button
        type='button'
        className='list-btn-component navbar-toggle'
        data-toggle='collapse'
        data-target='.navbar-responsive-collapse'
      >
        <span className='sr-only'>Toggle navigation</span>
        <span className='fa fa-bars'></span>
      </button>
    );
  }
}

ListBtn.displayName = 'ListBtn';

ListBtn.propTypes = {
};
ListBtn.defaultProps = {
};
