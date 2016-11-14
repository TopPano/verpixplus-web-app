'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./InfoPanel.css');
}

const propTypes = {
};

const defaultProps = {
};

class InfoPanel extends Component {
  render() {
    return (
      <div className="info-panel-component">
        <div className="info-panel-btn clickable">
          <div className="colelem" />
          <div className="colelem" />
          <div className="colelem" />
        </div>
      </div>
    );
  }
}

InfoPanel.propTypes = propTypes;
InfoPanel.defaultProps = defaultProps;

export default InfoPanel;
