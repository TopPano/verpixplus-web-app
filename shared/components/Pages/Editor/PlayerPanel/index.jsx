'use strict';

import React, { Component, PropTypes } from 'react';

import { MEDIA_TYPE } from 'constants/common';
import LivephotoPlayer from './LivephotoPlayer';
import PanophotoPlayer from './PanophotoPlayer';

if (process.env.BROWSER) {
  require('./PlayerPanel.css');
}

const propTypes = {
  meidaType: PropTypes.string.isRequired,
  storageId: PropTypes.string.isRequired,
  appliedData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  playerMode: PropTypes.string.isRequired,
  autoplay: PropTypes.bool.isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired,
  initialPanoLng: PropTypes.number.isRequired,
  initialPanoLat: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  setPanophotoFunctions: PropTypes.func.isRequired
};

const defaultProps = {
};

class PlayerPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      mediaType,
      appliedData,
      initialPanoLng,
      initialPanoLat,
      setPanophotoFunctions
    } = this.props;

    return (
      <div className="player-panel-component overflow-hidden">
        {
          (mediaType === MEDIA_TYPE.LIVE_PHOTO) ?
          <LivephotoPlayer {...this.props} /> :
          <PanophotoPlayer
            ref="panophoto"
            images={appliedData}
            initialLng={initialPanoLng}
            initialLat={initialPanoLat}
            setPanophotoFunctions={setPanophotoFunctions}
          />
        }
      </div>
    );
  }
}

PlayerPanel.propTypes = propTypes;
PlayerPanel.defaultProps = defaultProps;

export default PlayerPanel;
