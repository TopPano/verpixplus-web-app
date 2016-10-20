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
  isRemainder: PropTypes.bool.isRequired,
  isDividerHighlighted: PropTypes.bool.isRequired,
  hoverActiveDivider: PropTypes.func.isRequired,
  handleChangeStart: PropTypes.func.isRequired
};

const defaultProps = {
};

class FrameCarouselItem extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleDividerMouseOver = this.handleDividerMouseOver.bind(this);
    this.handleDividerMouseLeave = this.handleDividerMouseLeave.bind(this);
    this.handleDividerMouseDown = this.handleDividerMouseDown.bind(this);
  }

  handleDividerMouseOver(isActiveDivider) {
    this.props.hoverActiveDivider(isActiveDivider);
  }

  handleDividerMouseLeave() {
    this.props.hoverActiveDivider(false);
  }

  handleDividerMouseDown(e, type) {
    this.props.handleChangeStart(type, e.clientX);
  }

  // Render marks of ruler
  renderDividers(dividersRange, unitWidth, lower, upper, isDividerHighlighted) {
    return range(dividersRange.from, dividersRange.to).map((dividerIdx) => {
      let counter = dividerIdx + 1;
      const isLarge = counter % 10 === 0;
      const active = inRange(dividerIdx, lower, upper);
      const isFirst = dividerIdx === lower;
      const isLast = dividerIdx === upper - 1;
      const markClass = classNames({
        'marker': true,
        'large': isLarge
      });
      const overlayClass = classNames({
        'overlay': true,
        'active': active,
        'highlighted': isDividerHighlighted,
        'active-first': isFirst,
        'active-last': isLast
      });
      const dividerStyle = {
        width: `${unitWidth}px`
      };

      return (
        <div
          key={counter}
          className="divider"
          style={dividerStyle}
          onMouseOver={ () => { this.handleDividerMouseOver(active); } }
          onMouseLeave={this.handleDividerMouseLeave}
          onMouseOut={this.handleDividerMouseLeave}
          onMouseDown={ (e) => {
            const type = isFirst ? 'resize-left' : isLast ? 'resize-right' : active ? 'move' : 'none';
            this.handleDividerMouseDown(e, type);
          }}
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
      isRemainder,
      isDividerHighlighted
    } = this.props;
    const dividers = this.renderDividers(framesRange, unitWidth, lower, upper, isDividerHighlighted);
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
        <div className="img-wrapper">
          <img
            src={image}
            width={dimension.width}
            height={dimension.height}
          />
        </div>
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
