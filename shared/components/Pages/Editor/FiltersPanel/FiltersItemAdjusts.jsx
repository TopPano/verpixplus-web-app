'use strict';

import React, { Component, PropTypes } from 'react';

import EDITOR_CONTENT from 'content/editor/en-us.json';
import { renderList } from 'lib/utils';
import FlatButton from 'components/Common/FlatButton';
import SidebarItem from '../SidebarItem';
import Adjust from './Adjust';

const CONTENT = EDITOR_CONTENT.FILTERS_PANEL.ADJUSTS;

if (process.env.BROWSER) {
  require('./FiltersItemAdjusts.css');
}

const propTypes = {
  storageId: PropTypes.string.isRequired,
  imagesNum: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  adjustFilters: PropTypes.func.isRequired,
  applyFilters: PropTypes.func.isRequired
};

const defaultProps = {
};

class FiltersItemAdjusts extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleClickApply = this.handleClickApply.bind(this);
  }

  // Handler for clicking apply button
  handleClickApply() {
    const {
      storageId,
      imagesNum,
      filters,
      applyFilters
    } = this.props;

    applyFilters({
      storageId,
      from: 0,
      to: imagesNum,
      filters
    });
  }

  // Render list of adjustments
  renderAdjustList(propsList) {
    const { adjustFilters } = this.props;

    return renderList(propsList, (props, idx) => (
      <Adjust
        key={`${idx}${props.title}`}
        adjustFilters={adjustFilters}
        {...props}
      />
    ));
  }

  render() {
    const { filters } = this.props;
    const adjustListProps = [{
      type: 'brightness',
      title: CONTENT.BRIGHTNESS,
      initialValue: 0,
      min: -1,
      max: 1
    }, {
      type: 'contrast',
      title: CONTENT.CONTRAST,
      initialValue: 0,
      min: -1,
      max: 1
    }, {
      type: 'hue',
      title: CONTENT.HUE,
      initialValue: 0,
      min: -1,
      max: 1
    }, {
      type: 'saturation',
      title: CONTENT.SATURATION,
      initialValue: 0,
      min: -1,
      max: 1
    }, {
      type: 'vibrance',
      title: CONTENT.VIBRANCE,
      initialValue: 0,
      min: -1,
      max: 1
    }, {
      type: 'sepia',
      title: CONTENT.SEPIA,
      initialValue: 0,
      min: 0,
      max: 1
    }, {
      type: 'vignette',
      title: CONTENT.VIGNETTE,
      initialValue: 0,
      min: 0,
      max: 1
    }];
    const adjustList = this.renderAdjustList(adjustListProps);
    const applyBtnProps = {
      className: 'sidebar-btn',
      icon: 'file-image-o',
      text: CONTENT.APPLY,
      disabled: !filters.isDirty,
      onClick: this.handleClickApply
    }

    return (
      <div className="filters-item-adjusts-component">
        <SidebarItem
          icon="adjust"
          title={CONTENT.TITLE}
        >
          {adjustList}
          <div className="margin-bottom-25" />
          <FlatButton {...applyBtnProps} />
        </SidebarItem>
      </div>
    );
  }
}

FiltersItemAdjusts.propTypes = propTypes;
FiltersItemAdjusts.defaultProps = defaultProps;

export default FiltersItemAdjusts;
