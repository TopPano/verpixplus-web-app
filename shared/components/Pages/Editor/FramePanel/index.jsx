'use strict';

import React, { Component, PropTypes } from 'react';
import range from 'lodash/range';

import { FRAME } from 'constants/editor';
import FrameTrimmer from './FrameTrimmer';
import FrameCarousel from './FrameCarousel';

if (process.env.BROWSER) {
  require('./FramePanel.css');
}

const propTypes = {
  totalFrames: PropTypes.number
};

const defaultProps = {
  totalFrames: 150
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
    const newLower = value[0];
    const newUpper = value[1];
    const range = newUpper - newLower + 1;

    if (range <= FRAME.LIMIT) {
      this.setState({
        lower: newLower,
        upper: newUpper
      });
    }
  }

  render() {
    const { totalFrames } = this.props;
    const { lower, upper } = this.state;
    const trimmedFrames = upper - lower + 1;
    const trimmerProps = {
      min: 1,
      max: totalFrames,
      value: [ lower, upper ],
      onChange: this.handleRangeChange
    };
    const carouselProps = {
      images: range(0, totalFrames).map(() => 'http://static.boredpanda.com/blog/wp-content/uploads/2015/06/pallas-cat-manul-14__880.jpg'),
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
      </div>
    );
  }
}

FramePanel.propTypes = propTypes;
FramePanel.defaultProps = defaultProps;

export default FramePanel;
