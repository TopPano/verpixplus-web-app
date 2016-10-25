'use strict';

import React, { Component } from 'react';
import Collapse from 'react-bootstrap/lib/Collapse';
import classNames from 'classnames';

import ListItem from './ListItem';

if (process.env.BROWSER) {
  require('./List.css');
}

const propTypes = {
};

const defaultProps = {
};

class List extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functinos
    this.toggle = this.toggle.bind(this);

    // Initialize state
    this.state = {
      isShown: false
    };
  }

  // Toggle (Show or Hide) list
  toggle() {
    this.setState({
      isShown: !this.state.isShown
    });
  }

  render() {
    const { isShown } = this.state;
    const listClass = classNames({
      'list-component': true,
      'navbar-collapse': true,
      'mega-menu': true,
      'navbar-responsive-collapse': true
    });

    return (
      <Collapse in={isShown}>
        <div className={listClass}>
          <div className="container">
            <ul className="nav navbar-nav">
              <ListItem
                to="#"
                text="FIRST"
              />
              <ListItem
                to="#"
                text="SECOND"
              />
              <ListItem
                to="#"
                text="THIRD"
              />
            </ul>
          </div>
        </div>
      </Collapse>
    );
  }
}

List.propTypes = propTypes;
List.defaultProps = defaultProps;

export default List;
