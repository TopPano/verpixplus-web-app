'use strict';

import React, { Component, PropTypes } from 'react';

import EDITOR_CONTENT from 'content/editor/en-us.json';
import { renderList } from 'lib/utils';
import SidebarItem from '../SidebarItem';
import Adjust from './Adjust';

const CONTENT = EDITOR_CONTENT.FILTERS_PANEL.ADJUSTS;

if (process.env.BROWSER) {
  require('./FiltersItemAdjusts.css');
}

const propTypes = {
  filters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired
};

const defaultProps = {
};

class FiltersItemAdjusts extends Component {
  constructor(props) {
    super(props);
  }

  // Render list of adjustments
  renderAdjustList(propsList) {
    const {
      filters,
      applyFilters
    } = this.props;

    return renderList(propsList, (props, idx) => (
      <Adjust
        key={`${idx}${props.title}`}
        value={filters[props.type]}
        applyFilters={applyFilters}
        {...props}
      />
    ));
  }

  render() {
    const adjustListProps = [{
      type: 'contrast',
      title: CONTENT.CONTRAST,
      min: 0,
      max: 200
    }, {
      type: 'brightness',
      title: CONTENT.BRIGHTNESS,
      min: 0,
      max: 200
    }, {
      type: 'saturate',
      title: CONTENT.SATURATE,
      min: 0,
      max: 200
    }, {
      type: 'sepia',
      title: CONTENT.SEPIA,
      min: 0,
      max: 100
    }, {
      type: 'grayscale',
      title: CONTENT.GRAYSCALE,
      min: 0,
      max: 100
    }, {
      type: 'invert',
      title: CONTENT.INVERT,
      min: 0,
      max: 100
    }, {
      type: 'hue-rotate',
      title: CONTENT.HUE_ROTATE,
      min: 0,
      max: 360,
      unit: 'deg'
    }, {
      type: 'blur',
      title: CONTENT.BLUR,
      min: 0,
      max: 10,
      unit: 'px'
    }];
    const adjustList = this.renderAdjustList(adjustListProps);

    return (
      <div className="filters-item-adjusts-component">
        <SidebarItem
          icon="adjust"
          title={CONTENT.TITLE}
        >
          {adjustList}
        </SidebarItem>
      </div>
    );
  }
}

FiltersItemAdjusts.propTypes = propTypes;
FiltersItemAdjusts.defaultProps = defaultProps;

export default FiltersItemAdjusts;
