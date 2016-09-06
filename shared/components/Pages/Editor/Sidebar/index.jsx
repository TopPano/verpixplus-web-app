'use strict';

import React, { Component } from 'react';

import { renderList } from 'lib/utils';
import MenuItem from './MenuItem';
import EditPanel from '../EditPanel';
import SharePanel from '../SharePanel';

if (process.env.BROWSER) {
  require('./Sidebar.css');
}

const propTypes = {
};

const defaultProps = {
};

class Sidebar extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      selectedIdx: 0
    };
  }

  select(idx) {
    this.setState({
      selectedIdx: idx
    });
  }

  // Render Menu Items
  renderMenuItems(propsList) {
    return renderList(propsList, (cur, idx) => {
      return (
        <MenuItem
          icon={cur.icon}
          active={this.state.selectedIdx === idx}
          handleClick={this.select.bind(this, idx)}
        />
      );
    });
  }

  render() {
    const { selectedIdx } = this.state;
    const menuItemsProps = [{
      icon: 'pencil-square'
    }, {
      icon: 'share-alt-square'
    }];
    const menuItems = this.renderMenuItems(menuItemsProps);
    const panels = [
      <EditPanel />,
      <SharePanel />
    ];

    return (
      <div className="sidebar-component fill bg-color-dark">
        <div className="menu container bg-color-light-grey">
          {menuItems}
        </div>
        <div className="panel-wrapper container">
          {panels[selectedIdx]}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
