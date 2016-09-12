'use strict';

import React, { Component } from 'react';

import { renderList } from 'lib/utils';
import EDITOR_CONTENT from 'content/editor/en-us.json';
import SidebarItem from '../SidebarItem';

const CONTENT = EDITOR_CONTENT.SHARE_PANEL.SOCIAL;

if (process.env.BROWSER) {
  require('./ShareSocial.css');
}

const propTypes = {
};

const defaultProps = {
};

class ShareSocial extends Component {
  constructor(props) {
    super(props);
  }

  renderIconList(icons) {
    return renderList(icons, (icon, idx) => {
      return (
        <i
          key={idx}
          className={`share-icon icon-custom icon-md rounded-x icon-bg-grey icon-line clickable margin-right-10 margin-left-10 fa fa-${icon}`}
        />
      );
    });
  }

  render() {
    const icons = [
      'facebook',
      'twitter'
    ];
    const iconList = this.renderIconList(icons);

    return (
      <div className="share-social-component">
        <SidebarItem
          icon="share"
          title={CONTENT.TITLE}
        >
          <div className="container-center-col">
            {iconList}
          </div>
        </SidebarItem>
      </div>
    );
  }
}

ShareSocial.propTypes = propTypes;
ShareSocial.defaultProps = defaultProps;

export default ShareSocial;
