'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./PlayerPanel.css');
}

const propTypes = {
};

const defaultProps = {
};

class PlayerPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="player-panel-component bg-color-light container-center-col">
        <img src="http://static.boredpanda.com/blog/wp-content/uploads/2015/06/pallas-cat-manul-14__880.jpg" />
      </div>
    );
  }
}

PlayerPanel.propTypes = propTypes;
PlayerPanel.defaultProps = defaultProps;

export default PlayerPanel;
