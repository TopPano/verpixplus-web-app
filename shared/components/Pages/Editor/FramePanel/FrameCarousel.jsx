'use strict';

import React, { Component, PropTypes } from 'react';
import range from 'lodash/range';

import Carousel from 'components/Common/Carousel';
import FrameCarouselItem from './FrameCarouselItem';
import FrameCarouselWindow from './FrameCarouselWindow';

if (process.env.BROWSER) {
  require('./FrameCarousel.css');
}

const KEY_FRAME_WIDTH = 100;
const FRAME_STEP = 5;
const KEY_FRAME_LENGTH =
  parseInt(KEY_FRAME_WIDTH / FRAME_STEP, 10);

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

class FrameCarousel extends Component {
  constructor(props) {
    super(props);
  }

  // Resize the image dimension,
  // width is resized to ${KEY_FRAME_WIDTH},
  // height is proportionally resized.
  resizeDimension(dimension) {
    const { width, height } = dimension;

    return {
      width: KEY_FRAME_WIDTH,
      height: parseInt(height * (KEY_FRAME_WIDTH / width), 10)
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
    const items = this.renderItemList(images, resizedDimension, KEY_FRAME_LENGTH, lower, upper, FRAME_STEP);
    const windowProps = {
      framesNum: images.length,
      unitWidth: FRAME_STEP,
      height: resizedDimension.height,
      lower,
      upper,
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
