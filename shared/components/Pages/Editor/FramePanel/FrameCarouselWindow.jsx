'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Rnd from 'react-rnd';

import { FRAMES_LIMIT } from 'constants/editor';

if (process.env.BROWSER) {
  require('./FrameCarouselWindow.css');
}


const propTypes = {
  framesNum: PropTypes.number.isRequired,
  unitWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired,
  playerPlay: PropTypes.func.isRequired,
  playerPause: PropTypes.func.isRequired,
  trim: PropTypes.func.isRequired
};

const defaultProps = {
};

class FrameCarouselWindow extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResizeStop = this.handleResizeStop.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeStop = this.handleChangeStop.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleWindowMouseMove = this.handleWindowMouseMove.bind(this);

    // Initialize state
    this.state = {
      isInit: false,
      isChanging: false,
      resize: {
        isResizing: false
      }
    };
  }

  componentDidMount() {
    const {
      framesNum,
      unitWidth,
      height,
      lower,
      upper
    } = this.props;

    this.updatePosition(this.calculatePosition(lower, framesNum, unitWidth));
    this.updateSize(this.calculateSize(lower, upper, unitWidth, height));

    if (process.env.BROWSER) {
      window.addEventListener('mousemove', this.handleWindowMouseMove, true);
    }

    this.setState({
      isInit: true
    });
  }

  componentDidUpdate() {
    const {
      framesNum,
      unitWidth,
      height,
      lower,
      upper
    } = this.props;

    this.updatePosition(this.calculatePosition(lower, framesNum, unitWidth));
    this.updateSize(this.calculateSize(lower, upper, unitWidth, height));
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('mousemove', this.handleWindowMouseMove);
    }
  }

  // Handler for resize start
  handleResizeStart(direction, styleSize, clientSize, e) {
    this.handleChangeStart();

    this.setState({
      resize: {
        isResizing: true,
        direction,
        lastX: e.clientX
      }
    });
  }

  // Handler for resize stop
  handleResizeStop() {
    this.handleChangeStop();

    this.setState({
      resize: {
        isResizing: false
      }
    });
  }

  // Handler for start changing size or position
  handleChangeStart() {
    this.setState({
      isChanging: true
    });

    this.props.playerPause();
  }

  // Handler for start changing size or position
  handleChangeStop() {
    this.setState({
      isChanging: false
    });

    this.props.playerPlay();
  }

  // Handler for dragging
  handleDrag(e, ui) {
    const {
      unitWidth,
      lower,
      upper,
      trim
    } = this.props;
    const offset = parseInt(ui.deltaX / unitWidth, 10);

    if (offset !== 0) {
      trim({
        lower: lower + offset,
        upper: upper + offset
      });
    }
  }

  // Handler for mouse moving on window
  // XXX:
  // The onResize handler of Rnd cannot work on our case because the Swiper (Carousel) "absorbs" the mousemove event.
  // To solve the bug, we add our own event listener for mousemove event,
  // by calling window.addEventListener with "useCapture" option be true.
  handleWindowMouseMove(e) {
    const {
      unitWidth,
      framesNum,
      lower,
      upper,
      trim
    } = this.props;
    const {
      isResizing,
      direction,
      lastX
    } = this.state.resize;

    if (isResizing) {
      const offset = parseInt((e.clientX - lastX) / unitWidth, 10);

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
            resize: {
              isResizing: true,
              direction,
              lastX: lastX + (unitWidth * newOffset)
            }
          });

          trim({
            lower: newLower,
            upper: newUpper
          });
        }
      }
    }
  }

  // Calculate window width
  calculateWidth(lower, upper, unitWidth) {
    return (upper - lower) * unitWidth;
  }

  // Calculate window size
  calculateSize(lower, upper, unitWidth, height) {
    return {
      width: this.calculateWidth(lower, upper, unitWidth),
      height
    };
  }

  // Calculate window left and right bounds for draggin
  calculateBounds(lower, upper, framesNum, unitWidth) {
    return {
      top: 0,
      right: -(this.calculateWidth(lower, upper, unitWidth)),
      bottom: 0,
      left: this.calculatePosition(0, framesNum, unitWidth).x
    };
  }

  // Calculate window position based on parameters
  calculatePosition(lower, framesNum, unitWidth) {
    return {
      x: -((framesNum - lower) * unitWidth),
      y: 0
    };
  }

  // Update the position of window
  updatePosition(position) {
    this.refs.rnd.updatePosition(position);
  }

  // Update the size of window
  updateSize(size) {
    this.refs.rnd.updateSize(size);
  }

  render() {
    const {
      framesNum,
      unitWidth,
      height,
      lower,
      upper
    } = this.props;
    const {
      isInit,
      isChanging
    } = this.state;
    const componentClass = classNames({
      'frame-carousel-window-component': true,
      'active': isInit,
      'changing': isChanging
    });
    const componentProps = {
      ref: 'rnd',
      className: componentClass,
      initial: {
        x: this.calculatePosition(lower, framesNum, unitWidth).x,
        y: 0,
        width: this.calculateWidth(lower, upper, unitWidth),
        height
      },
      moveAxis: 'x',
      moveGrid: [unitWidth, unitWidth],
      resizeGrid: [unitWidth, unitWidth],
      bounds: this.calculateBounds(lower, upper, framesNum, unitWidth),
      minHeight: height,
      minWidth: this.calculateWidth(0, 1, unitWidth),
      maxWidth: this.calculateWidth(0, FRAMES_LIMIT, unitWidth),
      maxHeight: height,
      isResizable: {
        top: false,
        right: true,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false
      },
      onDragStart: this.handleChangeStart,
      onDrag: this.handleDrag,
      onDragStop: this.handleChangeStop,
      onResizeStart: this.handleResizeStart,
      onResizeStop: this.handleResizeStop
    };

    return (
      <Rnd {...componentProps} />
    );
  }
}

FrameCarouselWindow.propTypes = propTypes;
FrameCarouselWindow.defaultProps = defaultProps;

export default FrameCarouselWindow;
