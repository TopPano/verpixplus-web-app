'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import merge from 'lodash/merge';

if (process.env.BROWSER) {
  require('./ImageCarouselItem.css');
}

const propTypes = {
  src: PropTypes.string.isRequired,
  text: PropTypes.string,
  imageClass: PropTypes.string,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  active: PropTypes.bool,
  rounded: PropTypes.bool,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func
};

const defaultProps = {
  text: '',
  imageClass: '',
  dimension: {
    width: 0,
    height: 0
  },
  active: false,
  rounded: false,
  disabled: false,
  handleClick: () => {}
};

class ImageCarouselItem extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    const {
      src,
      text,
      imageClass,
      dimension,
      active,
      rounded,
      disabled,
      handleClick
    } = this.props;
    const othersClass = imageClass.split(' ').reduce((pre, cur) => {
      return merge({}, pre, {
        [cur]: true
      });
    }, {});
    const componentClass = classNames(merge({}, {
      'image-carousel-item-component': true,
      'swiper-slide': true,
      'clickable': true,
      'active': active
    }, othersClass));
    const imgClass = classNames({
      'rounded': rounded,
      'disabled': disabled
    });
    const textClass = classNames({
      'item-text': true,
      'text-center': true,
      'rounded-bottom': rounded
    });
    let componentStyle = {};

    if (dimension.width > 0) componentStyle.width = `${dimension.width}px`;
    if (dimension.height > 0) componentStyle.height = `${dimension.height}px`;

    return (
      <div
        className={componentClass}
        style={componentStyle}
        onClick={handleClick}
      >
        <img
          className={imgClass}
          src={src}
        />
        {
          text &&
          <div className={textClass}>{text}</div>
        }
      </div>
    );
  }
}

ImageCarouselItem.propTypes = propTypes;
ImageCarouselItem.defaultProps = defaultProps;

export default ImageCarouselItem;
