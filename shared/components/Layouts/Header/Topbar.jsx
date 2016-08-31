
'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

import SITE_CONTENT from 'content/site/en-us.json';

if (process.env.BROWSER) {
  require('./Topbar.css');
}

export default class Topbar extends Component {
  render() {
    return (
      <div className='topbar-component topbar'>
        <ul className='loginbar pull-right'>
          <li className='hoverSelector'>
            <i className='fa fa-globe' />
            <a>{"LANGUAGES"}</a>
            <ul className='languages hoverSelectorBlock'>
              <li className='active'>
                <Link to='#'>{"English"} <i className="fa fa-check" /></Link>
              </li>
              <li><Link to="#">{"繁體中文"}</Link></li>
            </ul>
          </li>
          <li className="topbar-devider"></li>
          <li><Link to={'/faq'}>{SITE_CONTENT.HEADER.FAQ}</Link></li>
          <li className="topbar-devider"></li>
          <li><Link to={'/signin'}>{SITE_CONTENT.HEADER.SIGN_IN}</Link></li>
        </ul>
      </div>
    );
  }
}

Topbar.displayName = 'Topbar';

Topbar.propTypes = {
};
Topbar.defaultProps = {
};