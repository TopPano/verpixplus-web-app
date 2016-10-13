'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import SITE_CONTENT from 'content/site/en-us.json';

if (process.env.BROWSER) {
  require('./Topbar.css');
}

const propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired
};

const defaultProps = {
};

class Topbar extends Component {
  constructor(props) {
    super(props);
  }

  // Render languages list
  renderLangList(langs) {
    const list = langs.reduce((pre, cur, idx) => {
      // TODO: isChoosen can be dynamically changed in the future
      const isChoosen = (idx === 0);
      const itemClass = classNames({
        'active': isChoosen
      });

      return ([
        ...pre,
        <li className={itemClass}>
          <a className="clickable">
            {cur}
            { isChoosen && <i className="fa fa-check" /> }
          </a>
        </li>
      ]);
    }, []);

    return (
      <ul className="languages hoverSelectorBlock">
        {list}
      </ul>
    );
  }

  render() {
    const {
      isAuthenticated,
      logout
    } = this.props;
    const langList = this.renderLangList(SITE_CONTENT.HEADER.LANG.LIST);

    return (
      <div className="topbar-component topbar">
        <ul className="loginbar pull-right">
          <li className="hoverSelector">
            <i className="fa fa-globe" />
            <a className="clickable">{` ${SITE_CONTENT.HEADER.LANG.TEXT}`}</a>
            {langList}
          </li>
          <li className="topbar-devider"></li>
          <li><Link to={"/faq"}>{SITE_CONTENT.HEADER.FAQ}</Link></li>
          <li className="topbar-devider"></li>
          {
            isAuthenticated ?
            <li
              className="clickable"
              onClick={logout}
            >
              <a>{SITE_CONTENT.HEADER.SIGN_OUT}</a>
            </li> :
            <li><Link to={"/signin"}>{SITE_CONTENT.HEADER.SIGN_IN}</Link></li>
          }
        </ul>
      </div>
    );
  }
}

Topbar.propTypes = propTypes;
Topbar.defaultProps = defaultProps;

export default Topbar;
