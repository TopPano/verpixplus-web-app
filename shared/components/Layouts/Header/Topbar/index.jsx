
'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import SITE_CONTENT from 'content/site/en-us.json';

if (process.env.BROWSER) {
  require('./Topbar.css');
}

const propTypes = {
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
          <li><Link to={"/signin"}>{SITE_CONTENT.HEADER.SIGN_IN}</Link></li>
        </ul>
      </div>
    );
  }
}

Topbar.propTypes = propTypes;
Topbar.defaultProps = defaultProps;

export default Topbar;
