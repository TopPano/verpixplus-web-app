'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./SharePanel.css');
}

const propTypes = {
};

const defaultProps = {
};

class SharePanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="share-panel-component">
      </div>
    );
  }
}

SharePanel.propTypes = propTypes;
SharePanel.defaultProps = defaultProps;

export default SharePanel;
