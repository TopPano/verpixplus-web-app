'use strict';

import React, { Component } from 'react';

import ShareSocial from './ShareSocial';
import ShareEmbed from './ShareEmbed';

if (process.env.BROWSER) {
  require('./SharePanel.css');
}

const propTypes = {
};

const defaultProps = {
};

class SharePanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="share-panel-component">
        <ShareSocial />
        <ShareEmbed />
      </div>
    );
  }
}

SharePanel.propTypes = propTypes;
SharePanel.defaultProps = defaultProps;

export default SharePanel;
