'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

if (process.env.BROWSER) {
  require('./MenuItem.css');
}

const propTypes = {
  icon: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func
};

const defaultProps = {
  handleClick: () => {}
};

class MenuItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      icon,
      active,
      handleClick
    } = this.props;
    const itemClass = classNames({
      'menu-item-component clickable circle': true,
      'active': active
    });

    return (
      <img
        className={itemClass}
        src={`/static/images/editor/${icon}.svg`}
        alt={icon}
        width="40"
        height="40"
        onClick={handleClick}
      />
    );
  }
}

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default MenuItem;
