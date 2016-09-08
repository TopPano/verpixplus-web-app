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
  active: PropTypes.bool,
  handleClick: PropTypes.func
};

const defaultProps = {
  text: '',
  active: false,
  imageClass: '',
  handleClick: () => {}
};

class ImageCarouselItem extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    const { src, text, imageClass, active, handleClick } = this.props;
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

    return (
      <div
        className={componentClass}
        onClick={handleClick}
      >
        <img
          className="rounded"
          src={src}
        />
        {
          text &&
          <div className="item-text text-center">{text}</div>
        }
      </div>
    );
  }
}

ImageCarouselItem.propTypes = propTypes;
ImageCarouselItem.defaultProps = defaultProps;

export default ImageCarouselItem;
