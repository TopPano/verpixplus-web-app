'use strict';

import React, { Component, PropTypes } from 'react';
import inRange from 'lodash/inRange';

import ImageCarousel from 'components/Common/ImageCarousel';

if (process.env.BROWSER) {
  require('./FrameCarousel.css');
}

const WIDTH_MAX = 100;
const HEIGHT_MAX = 100;

const propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired
};

const defaultProps = {
};

class FrameCarousel extends Component {
  constructor(props) {
    super(props);
  }

  // Decrease the dimension if too large
  decreaseDimension(dimension) {
    const { width, height } = dimension;

    if (height >= width && height > HEIGHT_MAX) {
      return {
        width: parseInt(width * (HEIGHT_MAX / height), 10),
        height: HEIGHT_MAX
      };
    } else if (width >= height && width > WIDTH_MAX) {
      return {
        width: WIDTH_MAX,
        height: parseInt(height * (WIDTH_MAX / width), 10)
      };
    } else {
      return dimension;
    }
  }

  render() {
    const {
      images,
      dimension,
      lower,
      upper
    } = this.props;
    const _images = images.map((cur, idx) => {
      return {
        src: cur,
        text: `${idx + 1}`,
        disabled: !inRange(idx + 1, lower, upper)
      };
    });
    const imgCarouselProps = {
      images: _images,
      dimension: this.decreaseDimension(dimension),
      carouselClass: 'frame-carousel rounded'
    };

    return (
      <div className="frame-carousel-component">
        <ImageCarousel {...imgCarouselProps} />
      </div>
    );
  }
}

FrameCarousel.propTypes = propTypes;
FrameCarousel.defaultProps = defaultProps;

export default FrameCarousel;
