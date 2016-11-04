'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import Scrollbar from 'react-custom-scrollbars';

import { MODE } from 'constants/editor';
import { EDIT_TARGET } from 'constants/editor';
import { renderList } from 'lib/utils';
import MenuItem from './MenuItem';
import EditPanel from '../EditPanel';
import FiltersPanel from 'containers/pages/Editor/FiltersPanel';

if (process.env.BROWSER) {
  require('./Sidebar.css');
}

const propTypes = {
  mode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  playerPlay: PropTypes.func.isRequired,
  playerPause: PropTypes.func.isRequired,
  changeEditTarget: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired
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

    this.curFilters = {};
  }

  // Handler for clicking menu item
  handleClickMenuItem(idx) {
    const { selectedIdx } = this.state;
    const {
      mode,
      playerPlay,
      playerPause,
      changeEditTarget
    } = this.props;

    if (selectedIdx !== idx) {
      if (mode === MODE.CREATE) {
        if (selectedIdx === 0 && idx === 1) {
          // Chnage from edit to filters panel
          playerPause();
          changeEditTarget(EDIT_TARGET.FILTERS);
        } else if (selectedIdx === 1 && idx === 0) {
          // Chnage from filters to edit panel
          playerPlay();
          changeEditTarget(EDIT_TARGET.FRAMES);
        }
      }

      this.setState({
        selectedIdx: idx
      });
    }
  }

  // Render Menu Items
  renderMenuItems(propsList, activeIdx) {
    return renderList(propsList, (cur, idx) => {
      return (
        <MenuItem
          key={idx}
          icon={cur.icon}
          active={activeIdx === idx}
          handleClick={this.handleClickMenuItem.bind(this, idx)}
        />
      );
    });
  }

  // Render sidebar panels
  renderSidebarPanels(panels, activeIdx) {
    return renderList(panels, (panel, idx) => {
      const panelClass = classNames({
        'sidebar-panel': true,
        'active': activeIdx === idx
      });

      return (
        <div
          className={panelClass}
          key={panel.key}
        >
          {panel}
        </div>
      );
    });
  }

  render() {
    const { selectedIdx } = this.state;
    const {
      mode,
      title,
      caption,
      edit
    } = this.props;
    const editMenuItemProp = {
      icon: 'pencil-square'
    };
    const filtersMenuItemProp = {
      icon: 'picture-o'
    };
    const editPanel =
      <EditPanel
        key="edit-panel"
        title={title}
        caption={caption}
        edit={edit}
      />
    const filtersPanel =
      <FiltersPanel
        key="filters-panel"
      />
    let menuItemsProps = [];
    let menuItems;
    let panels = [];
    let sidebarPanels;

    if (mode === MODE.WAIT_FILE) {
      menuItemsProps = [editMenuItemProp];
      panels = [editPanel];
    } else if (mode === MODE.CREATE) {
      menuItemsProps = [editMenuItemProp, filtersMenuItemProp];
      panels = [editPanel, filtersPanel];
    } else if (mode === MODE.EDIT) {
      menuItemsProps = [editMenuItemProp];
      panels = [editPanel];
    }

    menuItems = this.renderMenuItems(menuItemsProps, selectedIdx);
    sidebarPanels = this.renderSidebarPanels(panels, selectedIdx);

    return (
      <div className="sidebar-component fill bg-color-dark">
        <div className="menu bg-color-light-grey">
          {menuItems}
          <Link
            className="pull-right"
            to="/"
          >
            <MenuItem
              icon="times"
              active={false}
            />
          </Link>
        </div>
        <Scrollbar
          universal
        >
          <div className="sidebar-panels-container">
            {sidebarPanels}
          </div>
        </Scrollbar>
      </div>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
