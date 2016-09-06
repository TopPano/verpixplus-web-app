'use strict';

import React, { Component, PropTypes } from 'react';

import Panel from './Panel';

if (process.env.BROWSER) {
  require('./PanelGroup.css');
}

const propTypes = {
};

const defaultProps = {
};

class PanelGroup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="panel-group-component">
        <Panel />
        <Panel />
      </div>
    );
  }
}

PanelGroup.propTypes = propTypes;
PanelGroup.defaultProps = defaultProps;

export default PanelGroup;
