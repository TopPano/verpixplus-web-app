'use strict';

import React, { Component, PropTypes } from 'react';

import { FRAME } from 'constants/editor';
import FrameTrimmer from './FrameTrimmer';
import FrameCarousel from './FrameCarousel';

if (process.env.BROWSER) {
  require('./FramePanel.css');
}

const propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired
};

const defaultProps = {
};

class FramePanel extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member function
    this.handleRangeChange = this.handleRangeChange.bind(this);
    // Initialize state
    this.state = {
      lower: 1,
      upper: 100
    };
  }

  // Handler for Frame Trimmer range change
  handleRangeChange(value) {
    const { lower, upper } = this.state;
    const totalFrames = this.props.images.length;
    let newLower = value[0];
    let newUpper = value[1];
    const range = newUpper - newLower + 1;

    if (range <= FRAME.LIMIT) {
      this.setState({
        lower: newLower,
        upper: newUpper
      });
    } else {
      if (lower !== newLower) {
        newLower = upper - FRAME.LIMIT + 1;
        this.setState({
          lower: newLower >= 1 ? newLower : 1
        });
      } else if (upper !== newUpper) {
        newUpper = lower + FRAME.LIMIT - 1;
        this.setState({
          upper: newUpper <= totalFrames ? newUpper : totalFrames
        });
      }
    }
  }

  render() {
    const { images, dimension } = this.props;
    const { lower, upper } = this.state;
    const totalFrames = images.length;
    const trimmedFrames = upper - lower + 1;
    const trimmerProps = {
      min: 1,
      max: totalFrames,
      value: [ lower, upper ],
      onChange: this.handleRangeChange
    };
    const carouselProps = {
      images,
      dimension,
      lower,
      upper
    };

    return (
      <div className="frame-panel-component bg-color-light">
        <div className="text-center">{`Frames: ${trimmedFrames} / ${totalFrames}`}</div>
        <div className="margin-bottom-30" />
        <FrameTrimmer {...trimmerProps} />
        <div className="margin-bottom-15" />
        <FrameCarousel {...carouselProps} />
        <div className="margin-bottom-15" />
      </div>
    );
  }
}

FramePanel.propTypes = propTypes;
FramePanel.defaultProps = defaultProps;

export default FramePanel;
