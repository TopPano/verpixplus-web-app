'use strict';

import React, { Component, PropTypes } from 'react';

import { EDIT_TARGET } from 'constants/editor';
import FrameCarousel from './FrameCarousel';

if (process.env.BROWSER) {
  require('./FramePanel.css');
}

const propTypes = {
  appliedData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  editTarget: PropTypes.string.isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired,
  playerPlay: PropTypes.func.isRequired,
  playerPause: PropTypes.func.isRequired,
  trim: PropTypes.func.isRequired
};

const defaultProps = {
};

class FramePanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      appliedData,
      dimension,
      editTarget,
      lower,
      upper,
      playerPlay,
      playerPause,
      trim
    } = this.props;
    const carouselProps = {
      images: appliedData,
      dimension,
      lower,
      upper,
      disabled: editTarget !== EDIT_TARGET.FRAMES,
      playerPlay,
      playerPause,
      trim
    };

    return (
      <div className="frame-panel-component">
        <FrameCarousel {...carouselProps} />
      </div>
    );
  }
}

FramePanel.propTypes = propTypes;
FramePanel.defaultProps = defaultProps;

export default FramePanel;
