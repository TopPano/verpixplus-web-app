'use strict';

import React, { Component, PropTypes } from 'react';

import FiltersItemFilters from './FiltersItemFilters';
import FiltersItemAdjusts from './FiltersItemAdjusts';

if (process.env.BROWSER) {
  require('./FiltersPanel.css');
}

const propTypes = {
  filters: PropTypes.object.isRequired,
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
      filters,
      applyFilters
    } = this.props;

    return (
      <div className="filters-panel-component">
        <FiltersItemFilters />
        <FiltersItemAdjusts
          filters={filters}
          applyFilters={applyFilters}
        />
      </div>
    );
  }
}

FiltersPanel.propTypes = propTypes;
FiltersPanel.defaultProps = defaultProps;

export default FiltersPanel;
