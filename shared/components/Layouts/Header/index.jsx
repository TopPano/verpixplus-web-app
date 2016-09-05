'use strict';

import React, { Component, PropTypes } from 'react';
import Brand from './Brand';
import Topbar from './Topbar'
import List from './List';
import ListBtn from './ListBtn';

if (process.env.BROWSER) {
  require('./Header.css');
}

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='header-component header'>
        <div className='container'>
          <Brand />
          <Topbar />
          <ListBtn />
        </div>
        <List />
      </div>
    );
  }
}

Header.displayName = 'LayoutHeaderHeaderComponent';

Header.propTypes = {
  username: PropTypes.string,
  profilePhotoUrl: PropTypes.string,
  userId: PropTypes.string,
  logoutUser: PropTypes.func
};
Header.defaultProps = {
};
