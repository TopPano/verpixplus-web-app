'use strict';

import React, { Component, PropTypes } from 'react';

import { renderList } from 'lib/utils';
import FlatButton from 'components/Common/FlatButton';
import SidebarItem from '../SidebarItem';
import Adjust from './Adjust';

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
  static contextTypes = { i18n: PropTypes.object };

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
    const { l } = this.context.i18n;
    const { filters } = this.props;
    const adjustListProps = [{
      type: 'brightness',
      title: l('Brightness'),
      initialValue: 0,
      min: -1,
      max: 1
    }, {
      type: 'contrast',
      title: l('Contrast'),
      initialValue: 0,
      min: -1,
      max: 1
    }, {
      type: 'hue',
      title: l('Hue'),
      initialValue: 0,
      min: -1,
      max: 1
    }, {
      type: 'saturation',
      title: l('Saturation'),
      initialValue: 0,
      min: -1,
      max: 1
    }, {
      type: 'vibrance',
      title: l('Vibrance'),
      initialValue: 0,
      min: -1,
      max: 1
    }, {
      type: 'sepia',
      title: l('Sepia'),
      initialValue: 0,
      min: 0,
      max: 1
    }, {
      type: 'vignette',
      title: l('Vignette'),
      initialValue: 0,
      min: 0,
      max: 1
    }];
    const adjustList = this.renderAdjustList(adjustListProps);
    const applyBtnProps = {
      className: 'sidebar-btn',
      icon: 'file-image-o',
      text: l('Apply'),
      disabled: !filters.isDirty,
      onClick: this.handleClickApply
    }

    return (
      <div className="filters-item-adjusts-component">
        <SidebarItem>
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
