'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import range from 'lodash/range';

import Carousel from 'components/Common/Carousel';
import FrameCarouselItem from './FrameCarouselItem';

import { FRAMES_LIMIT } from 'constants/editor';

if (process.env.BROWSER) {
  require('./FrameCarousel.css');
}

const LANDSCAPE_WIDTH = 100;
const PORTRAIT_HEIGHT = 100;
const FRAME_STEP = 10;

const propTypes = {
  images: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  playerPlay: PropTypes.func.isRequired,
  playerPause: PropTypes.func.isRequired,
  trim: PropTypes.func.isRequired
};

const defaultProps = {
};

class FrameCarousel extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      range: {
        lower: props.lower,
        upper: props.upper
      },
      isHoveringActiveDivider: false,
      move: {
        isMoving: false,
        lastX: null
      },
      resize: {
        isResizing: false,
        direction: '',
        lastX: null
      }
    };

    // Bind "this" to member functions
    this.hoverActiveDivider = this.hoverActiveDivider.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleWindowMouseMove = this.handleWindowMouseMove.bind(this);
    this.handleWindowMouseUp = this.handleWindowMouseUp.bind(this);
  }

  componentDidMount() {
    if (process.env.BROWSER) {
      window.addEventListener('mousemove', this.handleWindowMouseMove, true);
      window.addEventListener('mouseup', this.handleWindowMouseUp, true);
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('mousemove', this.handleWindowMouseMove);
      window.removeEventListener('mouseup', this.handleWindowMouseUp);
    }
  }

  handleChangeStart(type, x) {
    const { playerPause } = this.props;

    if (type === 'move') {
      this.setState({
        move: {
          isMoving: true,
          lastX: x
        }
      });
      playerPause();
    } else if (type === 'resize-right') {
      this.setState({
        resize: {
          isResizing: true,
          direction: 'right',
          lastX: x
        }
      });
      playerPause();
    } else if (type === 'resize-left') {
      this.setState({
        resize: {
          isResizing: true,
          direction: 'left',
          lastX: x
        }
      });
      playerPause();
    }
  }

  handleWindowMouseMove(e) {
    if (this.state.move.isMoving) {
      const {
        lower,
        upper
      } = this.state.range;
      const framesNum = this.props.images.length;
      const { lastX } = this.state.move;
      const offset = parseInt((e.clientX - lastX) / FRAME_STEP, 10);

      if (Math.abs(offset) >= 1) {
        const newLower = lower + offset;
        const newUpper = upper + offset;
        if ((newLower >= 0) && (newUpper <= framesNum)) {
          this.setState({
            range: {
              lower: newLower,
              upper: newUpper
            },
            move: {
              isMoving: true,
              lastX: e.clientX
            }
          });
        }
      }
    } else if (this.state.resize.isResizing) {
      const {
        lower,
        upper
      } = this.state.range;
      const {
        lastX,
        direction
      } = this.state.resize;
      const framesNum = this.props.images.length;
      const offset = parseInt((e.clientX - lastX) / FRAME_STEP, 10);

      if (Math.abs(offset) >= 1) {
        let newUpper = upper;
        let newLower = lower;
        let newOffset = offset;

        if (direction === 'right') {
          newUpper =
            (((upper + offset) >= (framesNum) && (framesNum - lower) < FRAMES_LIMIT)) ? (framesNum) :
            ((upper + offset) >= (lower + FRAMES_LIMIT)) ? (lower + FRAMES_LIMIT) :
            ((upper + offset) <= (lower + 1)) ? (lower + 1) :
            (upper + offset);
          newOffset = newUpper - upper;
        } else {
          newLower =
            (((lower + offset) <= 0) && (upper < FRAMES_LIMIT)) ? 0 :
            ((lower + offset) <= (upper - FRAMES_LIMIT)) ? (upper - FRAMES_LIMIT) :
            ((lower + offset) >= (upper - 1)) ? (upper - 1) :
            (lower + offset);
          newOffset = newLower - lower;
        }

        if (newOffset !== 0) {
          this.setState({
            range: {
              lower: newLower,
              upper: newUpper
            },
            resize: {
              isResizing: true,
              direction,
              lastX: lastX + (FRAME_STEP * newOffset)
            }
          });
        }
      }
    }
  }

  handleWindowMouseUp() {
    const {
      range,
      move,
      resize
    } = this.state;
    const {
      trim,
      playerPlay
    } = this.props;

    if (move.isMoving) {
      this.setState({
        move: {
          isMoving: false,
          lastX: null
        }
      });
      trim({
        lower: range.lower,
        upper: range.upper
      });
      playerPlay();
    } else if (resize.isResizing) {
      this.setState({
        resize: {
          isResizing: false,
          direction: '',
          lastX: null
        }
      });
      trim({
        lower: range.lower,
        upper: range.upper
      });
      playerPlay();
    }
  }

  hoverActiveDivider(isHoveringActiveDivider) {
    if (this.state.isHoveringActiveDivider != isHoveringActiveDivider) {
      this.setState({
        isHoveringActiveDivider
      });
    }
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
  renderItemList(images, dimension, keyFrameLength, lower, upper, unitWidth, isDividerHighlighted) {
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
          isDividerHighlighted={isDividerHighlighted}
          hoverActiveDivider={this.hoverActiveDivider}
          handleChangeStart={this.handleChangeStart}
        />
      );
    });
  }

  render() {
    const { isHoveringActiveDivider } = this.state;
    const {
      range,
      move,
      resize
    } = this.state;
    const {
      images,
      dimension,
      disabled
    } = this.props;
    const componentClass = classNames({
      'frame-carousel-component': true,
      'disabled': disabled
    });
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
      carouselClass: 'frame-carousel'
    };
    const isDividerHighlighted = isHoveringActiveDivider || move.isMoving || resize.isResizing;
    const resizedDimension = this.resizeDimension(dimension);
    const keyFrameLength = parseInt(resizedDimension.width / FRAME_STEP, 10);
    const items = this.renderItemList(images, resizedDimension, keyFrameLength, range.lower, range.upper, FRAME_STEP, isDividerHighlighted);

    return (
      <div className={componentClass}>
        <Carousel {...carouselProps}>
          {items}
        </Carousel>
      </div>
    );
  }
}

FrameCarousel.propTypes = propTypes;
FrameCarousel.defaultProps = defaultProps;

export default FrameCarousel;
