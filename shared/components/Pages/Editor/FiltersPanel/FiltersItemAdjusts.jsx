'use strict';

import React, { Component, PropTypes } from 'react';

import EDITOR_CONTENT from 'content/editor/en-us.json';
import { renderList } from 'lib/utils';
import IconButton from 'components/Common/IconButton';
import SidebarItem from '../SidebarItem';
import Adjust from './Adjust';

const CONTENT = EDITOR_CONTENT.FILTERS_PANEL.ADJUSTS;

if (process.env.BROWSER) {
  require('./FiltersItemAdjusts.css');
}

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
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
      data,
      dimension,
      filters,
      applyFilters
    } = this.props;

    applyFilters({
      data,
      dimension,
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
      min: -100,
      max: 100
    }, {
      type: 'contrast',
      title: CONTENT.CONTRAST,
      initialValue: 0,
      min: -100,
      max: 100
    }, {
      type: 'saturation',
      title: CONTENT.SATURATION,
      initialValue: 0,
      min: -100,
      max: 100
    }, {
      type: 'vibrance',
      title: CONTENT.VIBRANCE,
      initialValue: 0,
      min: -100,
      max: 100
    }, {
      type: 'exposure',
      title: CONTENT.EXPOSURE,
      initialValue: 0,
      min: -100,
      max: 100
    }, {
      type: 'hue',
      title: CONTENT.HUE,
      initialValue: 0,
      min: 0,
      max: 100
    }, {
      type: 'sepia',
      title: CONTENT.SEPIA,
      initialValue: 0,
      min: 0,
      max: 100
    }, {
      type: 'gamma',
      title: CONTENT.GAMMA,
      initialValue: 0,
      min: 0,
      max: 10,
      step: 0.1
    }, {
      type: 'noise',
      title: CONTENT.NOISE,
      initialValue: 0,
      min: 0,
      max: 100
    }, {
      type: 'clip',
      title: CONTENT.CLIP,
      initialValue: 0,
      min: 0,
      max: 100
    }, {
      type: 'sharpen',
      title: CONTENT.SHARPEN,
      initialValue: 0,
      min: 0,
      max: 100
    }, {
      type: 'stackBlur',
      title: CONTENT.BLUR,
      initialValue: 0,
      min: 0,
      max: 20
    }];
    const adjustList = this.renderAdjustList(adjustListProps);
    const applyBtnProps = {
      className: 'btn btn-u text-uppercase rounded margin-right-10',
      icon: 'file-image-o',
      text: CONTENT.APPLY,
      disabled: !filters.isDirty,
      handleClick: this.handleClickApply
    }

    return (
      <div className="filters-item-adjusts-component">
        <SidebarItem
          icon="adjust"
          title={CONTENT.TITLE}
        >
          <IconButton {...applyBtnProps} />
          {adjustList}
        </SidebarItem>
      </div>
    );
  }
}

FiltersItemAdjusts.propTypes = propTypes;
FiltersItemAdjusts.defaultProps = defaultProps;

export default FiltersItemAdjusts;
