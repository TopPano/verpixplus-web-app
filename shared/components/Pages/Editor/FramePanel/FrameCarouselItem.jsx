'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import range from 'lodash/range';
import inRange from 'lodash/inRange';

if (process.env.BROWSER) {
  require('./FrameCarouselItem.css');
}

const propTypes = {
  image: PropTypes.string.isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  framesRange: PropTypes.object.isRequired,
  unitWidth: PropTypes.number.isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired,
  isRemainder: PropTypes.bool.isRequired
};

const defaultProps = {
};

class FrameCarouselItem extends Component {
  constructor(props) {
    super(props);
  }

  // Render marks of ruler
  renderDividers(dividersRange, unitWidth, lower, upper) {
    return range(dividersRange.from, dividersRange.to).map((dividerIdx) => {
      let counter = dividerIdx + 1;
      const isLarge = counter % 10 === 0;
      const active = inRange(dividerIdx, lower, upper);
      const markClass = classNames({
        'marker': true,
        'large': isLarge
      });
      const overlayClass = classNames({
        'overlay': true,
        'active': active
      });
      const dividerStyle = {
        width: `${unitWidth}px`
      };

      return (
        <div
          key={counter}
          className="divider"
          style={dividerStyle}
        >
          <div className={markClass}>
            {
              isLarge &&
              <div className="counter">
                {counter}
              </div>
            }
          </div>
          <div className={overlayClass} />
        </div>
      );
    });
  }

  render() {
    const {
      image,
      dimension,
      unitWidth,
      framesRange,
      lower,
      upper,
      isRemainder
    } = this.props;
    const dividers = this.renderDividers(framesRange, unitWidth, lower, upper);
    let componentStyle = {
      height: `${dimension.height}px`
    };

    if (!isRemainder) {
      componentStyle.width = `${dimension.width}px`;
    } else {
      const componentWidth = (framesRange.to - framesRange.from) * unitWidth;
      componentStyle.width = `${componentWidth}px`;
    }

    return (
      <div
        className="frame-carousel-item-component swiper-slide"
        style={componentStyle}
      >
        <img src={image} />
        <div className="dividers-wrapper">
          {dividers}
        </div>
      </div>
    );
  }
}

FrameCarouselItem.propTypes = propTypes;
FrameCarouselItem.defaultProps = defaultProps;

export default FrameCarouselItem;
