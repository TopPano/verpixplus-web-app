'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('./List.css');
}

export default class List extends Component {
  render() {
    return (
      <div className='list-component collapse navbar-collapse mega-menu navbar-responsive-collapse'>
        <div className='container'>
          <ul className='nav navbar-nav'>
            <li className='dropdown active'>
              <a className="dropdown-toggle" href='#' data-toggle="dropdown">{"FIRST"}</a>
              <ul className='dropdown-menu'>
                <li><Link to='#'>{"1-1"}</Link></li>
                <li><Link to='#'>{"1-2"}</Link></li>
                <li><Link to='#'>{"1-3"}</Link></li>
              </ul>
            </li>
            <li className='dropdown'>
              <a className="dropdown-toggle" href='#' data-toggle="dropdown">{"SECOND"}</a>
              <ul className='dropdown-menu'>
                <li><Link to='#'>{"2-1"}</Link></li>
                <li><Link to='#'>{"2-2"}</Link></li>
                <li><Link to='#'>{"2-3"}</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

List.displayName = 'List';

List.propTypes = {
};
List.defaultProps = {
};
