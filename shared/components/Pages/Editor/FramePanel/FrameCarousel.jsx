'use strict';

import React, { Component, PropTypes } from 'react';
import range from 'lodash/range';

import Carousel from 'components/Common/Carousel';
import FrameCarouselItem from './FrameCarouselItem';
import FrameCarouselWindow from './FrameCarouselWindow';

if (process.env.BROWSER) {
  require('./FrameCarousel.css');
}

const LANDSCAPE_WIDTH = 100;
const PORTRAIT_HEIGHT = 100;
const FRAME_STEP = 10;

const propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired,
  playerPlay: PropTypes.func.isRequired,
  playerPause: PropTypes.func.isRequired,
  trim: PropTypes.func.isRequired
};

const defaultProps = {
};

class FrameCarousel extends Component {
  constructor(props) {
    super(props);
  }

  // Resize the image dimension,
  resizeDimension(dimension) {
    const {
      width,
      height
    } = dimension;
    let newWidth;
    let newHeight;

    if (width >= height) {
      // Landscape
      newWidth = LANDSCAPE_WIDTH;
      newHeight = parseInt(height * (newWidth / width), 10);
    } else {
      // Portrait
      newHeight = PORTRAIT_HEIGHT;
      newWidth = parseInt(width * (newHeight / height), 10);
      newWidth = newWidth - (newWidth % FRAME_STEP);
    }

    return {
      width: newWidth,
      height: newHeight
    };
  }

  // Render list of items
  renderItemList(images, dimension, keyFrameLength, lower, upper, unitWidth) {
    const remainder = images.length % keyFrameLength;
    let keyFramesNum =
      parseInt(images.length / keyFrameLength, 10) + (remainder === 0 ? 0 : 1);

    return range(0, keyFramesNum).map((idx) => {
      const keyFrameIdx = idx * keyFrameLength;
      const keyFrame = images[keyFrameIdx];
      const isRemainder =
        (idx === keyFramesNum - 1) && (remainder !== 0);
      const framesRange = {
        from: keyFrameIdx,
        to: isRemainder ? keyFrameIdx + remainder : keyFrameIdx + keyFrameLength
      };

      return (
        <FrameCarouselItem
          key={idx}
          image={keyFrame}
          dimension={dimension}
          framesRange={framesRange}
          unitWidth={unitWidth}
          lower={lower}
          upper={upper}
          isRemainder={isRemainder}
        />
      );
    });
  }

  render() {
    const {
      images,
      dimension,
      lower,
      upper,
      playerPlay,
      playerPause,
      trim
    } = this.props;
    const carouselProps = {
      options: {
        freeMode: true,
        freeModeSticky: true,
        freeModeMomentum: false,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        allowSwipeToPrev: false,
        allowSwipeToNext: false,
        scrollbarHide: false,
        scrollbarDraggable: true
      },
      showScrollbar: true,
      carouselClass: 'frame-carousel rounded'
    };
    const resizedDimension = this.resizeDimension(dimension);
    const keyFrameLength = parseInt(resizedDimension.width / FRAME_STEP, 10);
    const items = this.renderItemList(images, resizedDimension, keyFrameLength, lower, upper, FRAME_STEP);
    const windowProps = {
      framesNum: images.length,
      unitWidth: FRAME_STEP,
      height: resizedDimension.height,
      lower,
      upper,
      playerPlay,
      playerPause,
      trim
    };

    return (
      <div className="frame-carousel-component rounded">
        <Carousel {...carouselProps}>
          {items}
          <FrameCarouselWindow {...windowProps} />
        </Carousel>
      </div>
    );
  }
}

FrameCarousel.propTypes = propTypes;
FrameCarousel.defaultProps = defaultProps;

export default FrameCarousel;
