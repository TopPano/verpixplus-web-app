'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./SidebarItem.css');
}

const propTypes = {
};

const defaultProps = {
};

class SidebarItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="sidebar-item-component">
        {this.props.children}
      </div>
    );
  }
}

SidebarItem.propTypes = propTypes;
SidebarItem.defaultProps = defaultProps;

export default SidebarItem;
