'use strict';

import React, { Component, PropTypes } from 'react';

import FiltersItemFilters from './FiltersItemFilters';
import FiltersItemAdjusts from './FiltersItemAdjusts';

if (process.env.BROWSER) {
  require('./FiltersPanel.css');
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

class FiltersPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      data,
      dimension,
      filters,
      adjustFilters,
      applyFilters
    } = this.props;

    return (
      <div className="filters-panel-component">
        <FiltersItemFilters />
        <FiltersItemAdjusts
          adjustFilters={adjustFilters}
          data={data}
          dimension={dimension}
          filters={filters}
          adjustFilters={adjustFilters}
          applyFilters={applyFilters}
        />
      </div>
    );
  }
}

FiltersPanel.propTypes = propTypes;
FiltersPanel.defaultProps = defaultProps;

export default FiltersPanel;
