'use strict';

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import scrollMonitor from 'scrollmonitor';

export default class ScrollablePageContainer extends Component {
  componentDidMount() {
    this.watcher = scrollMonitor.create(findDOMNode(this));
    this.watcher.partiallyExitViewport(this.handlePartiallyExitViewport);
  }

  componentWillUnmount() {
    this.watcher.destroy();
  }

  hasMoreContent() {
    return true;
  }

  isFetchingContent() {
    return true;
  }

  isLoadMoreEnabled() {
    return true;
  }

  requestMoreContent() {
  }

  loadMoreContent = () => {
    if(this.hasMoreContent() && !this.isFetchingContent() && this.isLoadMoreEnabled()) {
      this.requestMoreContent();
    }
  }

  handlePartiallyExitViewport = () => {
    // Determine: need to read more content or not.
    if(this.hasMoreContent() && !this.isFetchingContent() && this.isLoadMoreEnabled()) {
      // Scroll to bottom ?
      if(this.watcher.isAboveViewport) {
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

