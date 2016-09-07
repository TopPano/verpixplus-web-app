'use strict';

import React, { Component } from 'react';

import EditItemDesc from './EditItemDesc';

if (process.env.BROWSER) {
  require('./EditPanel.css');
}

const propTypes = {
};

const defaultProps = {
};

class EditPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="edit-panel-component">
        <EditItemDesc />
      </div>
    );
  }
}

EditPanel.propTypes = propTypes;
EditPanel.defaultProps = defaultProps;

export default EditPanel;
