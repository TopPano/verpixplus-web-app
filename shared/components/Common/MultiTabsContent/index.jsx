'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { renderList } from 'lib/utils';

if (process.env.BROWSER) {
  require('./MultiTabsContent.css');
}

const propTypes = {
  tabsContent: PropTypes.arrayOf(PropTypes.shape({
    tab: PropTypes.string.isRequired,
    content: PropTypes.node
  })).isRequired
};

const defaultProps = {
};

class MultiTabsContent extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      activeIdx: 0
    };
  }

  // Get index of current active tab
  getActiveIndex() {
    return this.state.activeIdx;
  }

  // handle for clicking tab
  selectTab(idx) {
    this.setState({
      activeIdx: idx
    });
  }

  // Render list of tabs
  renderTabs(tabsContent, activeIdx) {
    return renderList(tabsContent, (tabContent, idx) => {
      const tabClass = classNames({
        'active': idx === activeIdx,
        'clickable': true
      });

      return (
        <li
          key={idx}
          className={tabClass}
          onClick={() => { this.selectTab(idx) }}
        >
          <a>{tabContent.tab}</a>
        </li>
      );
    });
  }

  // Render all content
  renderAllContent(tabsContent, activeIdx) {
    return renderList(tabsContent, (tabContent, idx) => {
      const contentClass = classNames({
        'active': idx === activeIdx,
        'in': idx === activeIdx,
        'profile-edit': true,
        'tab-pane': true,
        'fade': true
      });

      return (
        <div
          key={idx}
          className={contentClass}
        >
          {tabContent.content}
        </div>
      );
    });
  }

  render() {
    const { activeIdx } = this.state;
    const { tabsContent } = this.props;
    const tabs = this.renderTabs(tabsContent, activeIdx);
    const allContent = this.renderAllContent(tabsContent, activeIdx);

    return (
      <div className="multi-tabs-content-component profile-body">
        <div className="tab-v1">
          <ul className="nav nav-justified nav-tabs">
            {tabs}
          </ul>
        </div>
        <div className="tab-content margin-top-20">
          {allContent}
        </div>
      </div>
    );
  }
}

MultiTabsContent.propTypes = propTypes;
MultiTabsContent.defaultProps = defaultProps;

export default MultiTabsContent;
