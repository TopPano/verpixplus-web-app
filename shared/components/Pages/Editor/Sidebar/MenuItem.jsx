'use strict';

import React, { Component, PropTypes } from 'react';
// import Button from 'react-bootstrap/lib/Button';
import classNames from 'classnames';

if (process.env.BROWSER) {
  require('./MenuItem.css');
}

const propTypes = {
  icon: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
};

const defaultProps = {
};

class MenuItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { icon, active, handleClick } = this.props;
    const itemClass = classNames({
      'menu-item-component': true,
      'btn-u': true,
      'bg-color-light-grey': true,
      'active': active
    });

    return (
      <button
        type="button"
        className={itemClass}
        onClick={handleClick}
      >
        <i className={`fa fa-${icon}`} />
      </button>
    );
  }
}

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default MenuItem;
