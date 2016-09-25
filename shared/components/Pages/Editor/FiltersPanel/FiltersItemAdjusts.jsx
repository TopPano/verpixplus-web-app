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
};

const defaultProps = {
};

class FiltersItemAdjusts extends Component {
  constructor(props) {
    super(props);
  }

  // Render list of adjustments
  renderAdjustList(propsList) {
    return renderList(propsList, (props, idx) => <Adjust key={`${idx}${props.title}`} {...props} />);
  }

  render() {
    const adjustListProps = [{
      title: CONTENT.CONTRAST,
      min: 0,
      max: 200,
      initialValue: 100
    }, {
      title: CONTENT.BRIGHTNESS,
      min: 0,
      max: 200,
      initialValue: 100
    }, {
      title: CONTENT.SATURATE,
      min: 0,
      max: 200,
      initialValue: 100
    }, {
      title: CONTENT.SEPIA,
      min: 0,
      max: 100,
      initialValue: 0
    }, {
      title: CONTENT.GRAYSCALE,
      min: 0,
      max: 100,
      initialValue: 0
    }, {
      title: CONTENT.INVERT,
      min: 0,
      max: 100,
      initialValue: 0
    }, {
      title: CONTENT.HUE_ROTATE,
      min: 0,
      max: 360,
      initialValue: 0,
      unit: 'deg'
    }, {
      title: CONTENT.BLUR,
      min: 0,
      max: 10,
      initialValue: 0,
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
