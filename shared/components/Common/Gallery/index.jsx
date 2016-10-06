'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Gallery.css');
}

const propTypes = {
  media: PropTypes.object.isRequired,
  mediaIds: PropTypes.array.isRequired,
  hasNext: PropTypes.bool.isRequired,
  deleteMedia: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired
};

const defaultProps = {
};

class Gallery extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { media, mediaIds, hasNext } = this.props;
    return(
      <div className="gallery-component container-fluid">
        <div className="gallery-wrapper">
        </div>
        {hasNext &&
          <div className="gallery-more-btn" onClick={this.handleClickMoreBtn}>{'more'}</div>
        }
      </div>
    );
  }
}

Gallery.propTypes = propTypes;
Gallery.defaultProps = defaultProps;

export default Gallery;
