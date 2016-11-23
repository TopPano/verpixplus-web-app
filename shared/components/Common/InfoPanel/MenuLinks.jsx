'use strict';

import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import classNames from 'classnames';

import { renderList } from 'lib/utils';
import { EXTERNAL_LINKS } from 'constants/common';

if (process.env.BROWSER) {
  require('./MenuLinks.css');
}

const propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
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
  static contextTypes = { i18n: PropTypes.object };

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

        if (props.external) {
          return (
            <a
              id={idx}
              className={linkClass}
              href={props.to}
            >
              {props.text}
            </a>
          );
        } else {
          return (
            <div
              key={idx}
              className={linkClass}
              to={props.to}
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
    const { l } = this.context.i18n;
    const {
      isAuthenticated,
      links
    } = this.props;
    let linksProps = [{
      to: '/',
      text: l('Home'),
      external: !isAuthenticated
    }];
    if (!isAuthenticated) {
      linksProps = linksProps.concat([{
          to: '/signin',
          text: l('Sign In')
        }, {
          to: '/signup',
          text: l('Sign Up')
        }]
      );
    } else {
      linksProps = linksProps.concat(
        links.length > 0 ? links : [{
          to: '/upload',
          text: l('Upload Media')
        }]
      );
    }
    linksProps = linksProps.concat([{
      break: true
    }, {
      to: EXTERNAL_LINKS.TERMS_OF_USE,
      text: l('Terms of Use'),
      external: true,
      small: true
    }, {
      to: EXTERNAL_LINKS.PRIVACY_POLICY,
      text: l('Privacy Policy'),
      external: true,
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
