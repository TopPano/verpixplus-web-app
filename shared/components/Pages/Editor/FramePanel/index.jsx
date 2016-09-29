'use strict';

import React, { Component, PropTypes } from 'react';

import FrameCarousel from './FrameCarousel';

if (process.env.BROWSER) {
  require('./FramePanel.css');
}

const propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired,
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
      images,
      dimension,
      lower,
      upper,
      trim
    } = this.props;
    const totalFrames = images.length;
    const trimmedFrames = upper - lower;
    const carouselProps = {
      images,
      dimension,
      lower,
      upper,
      trim
    };

    return (
      <div className="frame-panel-component bg-color-light">
        <FrameCarousel {...carouselProps} />
        <div className="margin-bottom-15" />
      </div>
    );
  }
}

FramePanel.propTypes = propTypes;
FramePanel.defaultProps = defaultProps;

export default FramePanel;
