'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('./ListItem.css');
}

const propTypes = {
  to: PropTypes.string,
  text: PropTypes.string
};

const defaultProps = {
  to: '#',
  text: ''
};

export default class ListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { to, text } = this.props;

    return (
      <li className="list-item-component">
        <Link
          className="dropdown-toggle clickable"
          to={to}
        >
          {text}
        </Link>
      </li>
    );
  }
}

ListItem.propTypes = propTypes;
ListItem.defaultProps = defaultProps;

export default ListItem;
