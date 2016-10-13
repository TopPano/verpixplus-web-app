'use strict';

import React, { Component, PropTypes } from 'react';
import Brand from './Brand';
import Topbar from './Topbar'
import List from './List';
import ListBtn from './ListBtn';

if (process.env.BROWSER) {
  require('./Header.css');
}

const propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired
};

const defaultProps = {
};

class Header extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to memeber functions
    this.handleClickBtn = this.handleClickBtn.bind(this);
  }

  // Handler for click list-button
  handleClickBtn() {
    this.refs.list.toggle();
  }

  render() {
    const {
      isAuthenticated,
      logout
    } = this.props;

    return (
      <div className='header-component header'>
        <div className='container'>
          <Brand />
          <Topbar
            isAuthenticated={isAuthenticated}
            logout={logout}
          />
          <ListBtn handleClick={this.handleClickBtn} />
        </div>
        <List ref="list" />
      </div>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
