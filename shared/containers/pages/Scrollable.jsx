'use strict';

import React, { Component } from 'react';

const REMAINED_SCROLL_OFFSET = 100;

export default class ScrollablePageContainer extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  hasMoreContent() {
    return true;
  }

  isFetchingContent() {
    return true;
  }

  requestMoreContent() {
  }

  loadMoreContent = () => {
    if(this.hasMoreContent() && !this.isFetchingContent()) {
      this.requestMoreContent();
    }
  }

  handleScroll = () => {
    // Determine: need to read more content or not.
    if(this.hasMoreContent() && !this.isFetchingContent()) {
      var offset = window.scrollY + window.innerHeight;
      var height = document.documentElement.offsetHeight - REMAINED_SCROLL_OFFSET;

      // Scroll to the bottom?
      if(offset >= height) {
        this.requestMoreContent();
      }
    }
  }

  render() {
    return (
      <div />
    );
  }
}

