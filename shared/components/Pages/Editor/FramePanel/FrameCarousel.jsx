'use strict';

import React, { Component, PropTypes } from 'react';
import inRange from 'lodash/inRange';

import ImageCarousel from 'components/Common/ImageCarousel';

if (process.env.BROWSER) {
  require('./FrameCarousel.css');
}

const propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired
};

const defaultProps = {
};

class FrameCarousel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { images, lower, upper } = this.props;
    const _images = images.map((cur, idx) => {
      return {
        src: cur,
        text: `${idx + 1}`,
        disabled: !inRange(idx + 1, lower, upper)
      };
    });
    const options = {
      centeredSlides: true
    };
    const imgCarouselProps = {
      images: _images,
      carouselClass: 'frame-carousel rounded',
      imageClass: 'frame-image',
      options
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
