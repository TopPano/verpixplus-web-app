'use strict';

import React, { Component, PropTypes } from 'react';

import { renderList } from 'lib/utils';
import MenuItem from './MenuItem';
import EditPanel from '../EditPanel';
import SharePanel from '../SharePanel';

if (process.env.BROWSER) {
  require('./Sidebar.css');
}

const propTypes = {
  mediaType: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  create: PropTypes.func.isRequired
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
          key={idx}
          icon={cur.icon}
          active={this.state.selectedIdx === idx}
          handleClick={this.select.bind(this, idx)}
        />
      );
    });
  }

  render() {
    const { selectedIdx } = this.state;
    const {
      mediaType,
      data,
      dimension,
      create
    } = this.props;
    const menuItemsProps = [{
      icon: 'pencil-square'
    }, {
      icon: 'share-alt-square'
    }];
    const menuItems = this.renderMenuItems(menuItemsProps);
    const panels = [
      <EditPanel
        key="edit-panel"
        mediaType={mediaType}
        data={data}
        dimension={dimension}
        create={create}
      />,
      <SharePanel key="share-panel" />
    ];

    return (
      <div className="sidebar-component fill bg-color-dark">
        <div className="menu bg-color-light-grey">
          {menuItems}
        </div>
        <div className="panel-wrapper">
          {panels[selectedIdx]}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
