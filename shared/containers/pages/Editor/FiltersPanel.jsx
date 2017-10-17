'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  adjustFilters,
  applyFilters
} from 'actions/editor';

import FiltersPanel from 'components/Pages/Editor/FiltersPanel';

const propTypes = {
  editor: PropTypes.object.isRequired
};

const defaultProps = {
};

class FiltersPanelContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member function
    this.adjustFilters = this.adjustFilters.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
  }

  // Wrapper for dispatching adjustFilters function,
  // which updates the filter values of this media
  adjustFilters(filters) {
    this.props.dispatch(adjustFilters(filters));
  }

  // Wrapper for dispatching applyFilters function,
  // which updates the filter values to original data
  applyFilters(params) {
    this.props.dispatch(applyFilters(params));
  }

  render() {
    const { editor } = this.props;

    return (
      <FiltersPanel
        {...editor}
        imagesNum={editor.appliedData.length}
        adjustFilters={this.adjustFilters}
        applyFilters={this.applyFilters}
      />
    );
  }
}

FiltersPanelContainer.propTypes = propTypes;
FiltersPanelContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { editor } = state;
  return {
    editor
  };
}

export default connect(mapStateToProps)(FiltersPanelContainer);
