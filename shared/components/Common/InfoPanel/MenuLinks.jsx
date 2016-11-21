'use strict';

import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import classNames from 'classnames';

import CONTENT from 'content/common/en-us.json';
import { renderList } from 'lib/utils';
import { EXTERNAL_LINKS } from 'constants/common';

const { INFO_PANEL } = CONTENT;

if (process.env.BROWSER) {
  require('./MenuLinks.css');
}

const propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })),
  close: PropTypes.func.isRequired
};

const defaultProps = {
  links: []
};

class MenuLinks extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleClickLink = this.handleClickLink.bind(this);
  }

  // Handler for clicking link
  handleClickLink(to) {
    this.props.close();
    browserHistory.push(to);
  }

  // Render list of links
  renderLinks(propsList) {
    return renderList(propsList, (props, idx) => {
      if (props.break) {
        return (
          <div className="margin-bottom-20" />
        );
      } else {
        const linkClass = classNames({
          'menu-link': true,
          'text-link': true,
          'small': props.small
        });

        if (props.blank) {
          return (
            <Link
              id={idx}
              className={linkClass}
              to={props.to}
              target="_blank"
            >
              {props.text}
            </Link>
          );
        } else {
          return (
            <div
              key={idx}
              className={linkClass}
              to={props.to}
              target={props.blank ? '_blank' : '_self'}
              onClick={() => { this.handleClickLink(props.to); }}
            >
              {props.text}
            </div>
          );
        }
      }
    });
  }

  render() {
    const { links } = this.props;
    let linksProps = [{
      to: '/',
      text: INFO_PANEL.HOME
    }];
    linksProps = linksProps.concat(
      links.length > 0 ? links : [{
        to: '/upload',
        text: `${INFO_PANEL.UPLOAD} ${INFO_PANEL.MEDIA}`
      }]
    );
    linksProps = linksProps.concat([{
      break: true
    }, {
      to: '/faq',
      text: INFO_PANEL.SUPPORT,
      small: true
    }, {
      to: EXTERNAL_LINKS.TERMS_OF_USE,
      text: CONTENT.TERMS_OF_USE,
      blank: true,
      small: true
    }, {
      to: EXTERNAL_LINKS.PRIVACY_POLICY,
      text: CONTENT.PRIVACY_POLICY,
      blank: true,
      small: true
    }]);
    const menuLinks = this.renderLinks(linksProps);

    return (
      <div className="menu-links-component">
        {menuLinks}
      </div>
    );
  }
}

MenuLinks.propTypes = propTypes;
MenuLinks.defaultProps = defaultProps;

export default MenuLinks;
