'use strict';

import React, { Component, PropTypes } from 'react';

import ShareEmbedCoder from './ShareEmbedCoder';

if (process.env.BROWSER) {
  require('./ShareLink.css');
}

const propTypes = {
  shareUrl: PropTypes.string.isRequired
};

const defaultProps = {
};

class ShareLink extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { shareUrl } = this.props;

    return (
      <div className="share-link-component">
        <ShareEmbedCoder text={shareUrl} />
      </div>
    );
  }
}

ShareLink.propTypes = propTypes;
ShareLink.defaultProps = defaultProps;

export default ShareLink;
