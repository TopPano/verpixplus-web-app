'use strict';

import React, { Component, PropTypes } from 'react';

import EditItemDesc from './EditItemDesc';
import EditItemFilter from './EditItemFilter';
import EditItemAdjust from './EditItemAdjust';
import EditItemSettings from './EditItemSettings';

if (process.env.BROWSER) {
  require('./EditPanel.css');
}

const propTypes = {
  mediaType: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  create: PropTypes.func.isRequired
};

const defaultProps = {
};

class EditPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      mediaType,
      data,
      dimension,
      create
    } = this.props;

    return (
      <div className="edit-panel-component">
        <EditItemDesc />
        <EditItemAdjust />
        <EditItemFilter />
        <EditItemSettings
          mediaType={mediaType}
          data={data}
          dimension={dimension}
          create={create}
        />
      </div>
    );
  }
}

EditPanel.propTypes = propTypes;
EditPanel.defaultProps = defaultProps;

export default EditPanel;
