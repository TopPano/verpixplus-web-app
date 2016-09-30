'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Rnd from 'react-rnd';

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
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.handleDrag = this.handleDrag.bind(this);

    // Initialize state
    this.state = {
      isInit: false,
      isDragged: false
    };
  }

  componentDidMount() {
    const {
      framesNum,
      lower,
      unitWidth
    } = this.props;

    this.updatePosition(this.calculatePosition(lower, framesNum, unitWidth));
    this.setState({
      isInit: true
    });
  }

  // Handler for start dragging
  handleDragStart() {
    this.setState({
      isDragged: true
    });

    this.props.playerPause();
  }

  // Handler for stop dragging
  handleDragStop() {
    this.setState({
      isDragged: false
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

    trim({
      lower: lower + offset,
      upper: upper + offset
    });
  }

  // Calculate window width
  calculateWidth(lower, upper, unitWidth) {
    return (upper - lower) * unitWidth;
  }

  // Calculate window left and right bounds for draggin
  calculateBounds(lower, upper, framesNum, unitWidth) {
    return {
      left: this.calculatePosition(0, framesNum, unitWidth).x,
      right: -(this.calculateWidth(lower, upper, unitWidth))
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
      isDragged
    } = this.state;
    const componentClass = classNames({
      'frame-carousel-window-component': true,
      'active': isInit,
      'dragged': isDragged
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
      bounds: this.calculateBounds(lower, upper, framesNum, unitWidth),
      onDragStart: this.handleDragStart,
      onDrag: this.handleDrag,
      onDragStop: this.handleDragStop
    };

    return (
      <Rnd {...componentProps} />
    );
  }
}

FrameCarouselWindow.propTypes = propTypes;
FrameCarouselWindow.defaultProps = defaultProps;

export default FrameCarouselWindow;
