'use strict';

import React, { Component, PropTypes } from 'react';

import FiltersItemFilters from './FiltersItemFilters';
import FiltersItemAdjusts from './FiltersItemAdjusts';

if (process.env.BROWSER) {
  require('./FiltersPanel.css');
}

const propTypes = {
};

const defaultProps = {
};

class FiltersPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="filters-panel-component">
        <FiltersItemFilters />
        <FiltersItemAdjusts />
      </div>
    );
  }
}

FiltersPanel.propTypes = propTypes;
FiltersPanel.defaultProps = defaultProps;

export default FiltersPanel;
