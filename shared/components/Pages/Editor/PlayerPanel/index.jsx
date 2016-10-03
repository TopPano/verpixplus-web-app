'use strict';

import React, { Component, PropTypes } from 'react';

import LivephotoPlayer from './LivephotoPlayer';

if (process.env.BROWSER) {
  require('./PlayerPanel.css');
}

const propTypes = {
  imagesData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  playerMode: PropTypes.string.isRequired,
  autoplay: PropTypes.bool.isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired
};

const defaultProps = {
};

class PlayerPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      imagesData,
      dimension,
      playerMode,
      autoplay,
      lower,
      upper
    } = this.props;

    return (
      <div className="player-panel-component bg-color-light">
        <LivephotoPlayer
          imagesData={imagesData}
          dimension={dimension}
          playerMode={playerMode}
          autoplay={autoplay}
          lower={lower}
          upper={upper}
        />
      </div>
    );
  }
}

PlayerPanel.propTypes = propTypes;
PlayerPanel.defaultProps = defaultProps;

export default PlayerPanel;
