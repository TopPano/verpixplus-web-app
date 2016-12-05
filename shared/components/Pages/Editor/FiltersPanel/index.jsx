'use strict';

import React, { Component, PropTypes } from 'react';

import FiltersItemAdjusts from './FiltersItemAdjusts';

if (process.env.BROWSER) {
  require('./FiltersPanel.css');
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

class FiltersPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="filters-panel-component">
        <FiltersItemAdjusts {...this.props} />
      </div>
    );
  }
}

FiltersPanel.propTypes = propTypes;
FiltersPanel.defaultProps = defaultProps;

export default FiltersPanel;
