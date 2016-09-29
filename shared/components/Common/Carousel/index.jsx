'use strict';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import merge from 'lodash/merge';

import { execute } from 'lib/utils';

if (process.env.BROWSER) {
  require('swiper/dist/css/swiper.css');
  require('./Carousel.css');
}

const propTypes = {
  options: PropTypes.object,
  showScrollbar: PropTypes.bool,
  carouselclass: PropTypes.string,
  onClick: PropTypes.func
}

const defaultProps = {
  options: {},
  showScrollbar: false,
  carouselclass: '',
  onClick: () => {}
}

class Carousel extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleClick = this.handleClick.bind(this);
  }

  // Handler for clicking any slide
  handleClick(swiper) {
    execute(this.props.onClick, swiper.clickedIndex);
  }

  // Initialize Swiper instance when component is mounted
  componentDidMount() {
    if (process.env.BROWSER) {
      const Swiper = require('swiper');
    const { showScrollbar } = this.props;
      const _options = merge({}, this.props.options, {
        scrollbar: showScrollbar ? '.swiper-scrollbar' : '',
        onClick: this.handleClick
      });

      this.swiper = new Swiper(ReactDOM.findDOMNode(this), _options);
    }
  }

  // Update Swiper instance
  componentDidUpdate() {
    if (process.env.BROWSER) {
      this.swiper.update();
    }
  }

  render() {
    const {
      showScrollbar,
      carouselClass
    } = this.props;
    const othersClass = carouselClass.split(' ').reduce((pre, cur) => {
      return merge({}, pre, {
        [cur]: true
      });
    }, {});
    const componentClass = classNames(merge({}, {
      'carousel-component': true,
      'swiper-container': true
    }, othersClass));

    return (
      <div className={componentClass}>
        <div className="swiper-wrapper">
          {this.props.children}
        </div>
        {
          showScrollbar &&
          <div className="swiper-scrollbar" />
        }
      </div>
    );
  }
}

Carousel.propTypes = propTypes;
Carousel.defaultProps = defaultProps;

export default Carousel;
