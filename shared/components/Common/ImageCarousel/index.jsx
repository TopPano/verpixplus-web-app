'use strict';

import React, { Component, PropTypes } from 'react';
import merge from 'lodash/merge';

import Carousel from 'components/Common/Carousel';
import ImageCarouselItem from './ImageCarouselItem';
import {
  renderList,
  execute
} from 'lib/utils';

if (process.env.BROWSER) {
  require('./ImageCarousel.css');
}

const propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string.isRequired,
    text: PropTypes.string
  })).isRequired,
  carouselclass: PropTypes.string,
  imageclass: PropTypes.string,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  spaceBetween: PropTypes.number,
  rounded: PropTypes.bool,
  isVertical: PropTypes.bool,
  options: PropTypes.object,
  onClick: PropTypes.func
};

const defaultProps = {
  carouselclass: '',
  imageclass: '',
  dimension: {
    width: 0,
    height: 0
  },
  spaceBetween: 5,
  rounded: false,
  isVertical: false,
  options: {},
  onClick: () => {}
};

class ImageCarousel extends Component{
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleClick = this.handleClick.bind(this);

    // Initialize state
    this.state = {
      selectedIdx: 0
    };
  }

  // Handler for click an item
  handleClick(selectedIdx) {
    const { onClick } = this.props;

    execute(onClick, selectedIdx);

    this.setState({
      selectedIdx
    });
  }

  // Render list of items
  renderItemList(propsList) {
    const { selectedIdx } = this.state;
    const {
      imageClass,
      dimension,
      disabled,
      rounded
    } = this.props;

    return renderList(propsList, (props, idx) => {
      return (
        <ImageCarouselItem
          key={idx}
          active={idx === selectedIdx}
          imageClass={imageClass}
          dimension={dimension}
          rounded={rounded}
          disabled={disabled}
          {...props}
        />
      );
    });
  }

  render() {
    const { images, carouselClass, spaceBetween, isVertical, options } = this.props;
    const carouselProps = {
      options: merge({}, {
        freeMode: true,
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        direction: isVertical ? 'vertical' : 'horizontal',
        mousewheelControl: true,
        spaceBetween
      }, options),
      carouselClass: carouselClass,
      onClick: this.handleClick
    };
    const items = this.renderItemList(images);

    return (
      <div className="image-carousel-component">
        <Carousel
          {...carouselProps}
        >
          {items}
        </Carousel>
      </div>
    );
  }
}

ImageCarousel.propTypes = propTypes;
ImageCarousel.defaultProps = defaultProps;

export default ImageCarousel;
