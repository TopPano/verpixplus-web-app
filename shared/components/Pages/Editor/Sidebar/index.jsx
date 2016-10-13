'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ScrollArea from 'react-scrollbar';

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
  appliedData: PropTypes.arrayOf(PropTypes.object).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  autoplay: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  playerPlay: PropTypes.func.isRequired,
  playerPause: PropTypes.func.isRequired,
  playerSetAutoplay: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  adjustFilters: PropTypes.func.isRequired,
  applyFilters: PropTypes.func.isRequired,
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

    this.curFilters = {};
  }

  // Handler for clicking menu item
  handleClickMenuItem(idx) {
    const { selectedIdx } = this.state;
    const {
      mode,
      playerPlay,
      playerPause
    } = this.props;

    if (selectedIdx !== idx) {
      if (mode === MODE.CREATE) {
        if (selectedIdx === 0 && idx === 1) {
          // Chnage from edit to filters panel
          playerPause();
        } else if (selectedIdx === 1 && idx === 0) {
          // Chnage from filters to edit panel
          playerPlay();
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
      mediaType,
      title,
      data,
      appliedData,
      caption,
      dimension,
      autoplay,
      playerSetAutoplay,
      filters,
      edit,
      adjustFilters,
      applyFilters,
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
        appliedData={appliedData}
        dimension={dimension}
        autoplay={autoplay}
        playerSetAutoplay={playerSetAutoplay}
        edit={edit}
        create={create}
      />
    const filtersPanel =
      <FiltersPanel
        key="filters-panel"
        data={data}
        dimension={dimension}
        filters={filters}
        adjustFilters={adjustFilters}
        applyFilters={applyFilters}
      />
    const sharePanel =
      <SharePanel key="share-panel" />
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
      menuItemsProps = [editMenuItemProp, shareMenuItemProp];
      panels = [editPanel, sharePanel];
    }

    menuItems = this.renderMenuItems(menuItemsProps, selectedIdx);
    sidebarPanels = this.renderSidebarPanels(panels, selectedIdx);

    return (
      <div className="sidebar-component fill bg-color-dark">
        <div className="menu bg-color-light-grey">
          {menuItems}
        </div>
        <ScrollArea
          className="sidebar-panels-container"
          horizontal={false}
        >
          {sidebarPanels}
        </ScrollArea>
      </div>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
