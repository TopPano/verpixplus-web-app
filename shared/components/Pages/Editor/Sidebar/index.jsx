'use strict';

import React, { Component, PropTypes } from 'react';

import { MODE } from 'constants/editor';
import { renderList } from 'lib/utils';
import MenuItem from './MenuItem';
import EditPanel from '../EditPanel';
import FiltersPanel from '../FiltersPanel';
import SharePanel from '../SharePanel';

if (process.env.BROWSER) {
  require('./Sidebar.css');
}

const propTypes = {
  mode: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  edit: PropTypes.func.isRequired,
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
      mode,
      mediaType,
      title,
      caption,
      data,
      dimension,
      edit,
      create
    } = this.props;
    const editMenuItemProp = {
      icon: 'pencil-square'
    };
    const filtersMenuItemProp = {
      icon: 'picture-o'
    };
    const shareMenuItemProp = {
      icon: 'share-alt-square'
    };
    const editPanel =
      <EditPanel
        key="edit-panel"
        mode={mode}
        mediaType={mediaType}
        title={title}
        caption={caption}
        data={data}
        dimension={dimension}
        edit={edit}
        create={create}
      />
    const filtersPanel =
      <FiltersPanel />
    const sharePanel =
      <SharePanel key="share-panel" />
    let menuItemsProps = [];
    let menuItems;
    let panels = [];

    if (mode === MODE.WAIT_FILE || mode === MODE.CREATE) {
      menuItemsProps = [editMenuItemProp, filtersMenuItemProp];
      panels = [editPanel, filtersPanel];
    } else if (mode === MODE.EDIT) {
      menuItemsProps = [editMenuItemProp, shareMenuItemProp];
      panels = [editPanel, sharePanel];
    }

    menuItems = this.renderMenuItems(menuItemsProps);

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
