'use strict';

import React, { Component, PropTypes } from 'react';
import merge from 'lodash/merge';
import range from 'lodash/range';

import GalleryRow from './GalleryRow';

if (process.env.BROWSER) {
  require('./Gallery.css');
}

const propTypes = {
  media: PropTypes.object.isRequired,
  mediaIds: PropTypes.array.isRequired,
  hasNext: PropTypes.bool.isRequired,
  deleteMedia: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired
};

const defaultProps = {
};

class Gallery extends Component {
  constructor(props) {
    super(props);
  }

  // Render list of gallery rows
  renderRows(media, mediaIds, isFetching, deleteMedia) {
    const numOfRows = Math.ceil(mediaIds.length / 4);

    return range(0, numOfRows).map((idx) => {
      const subMediaList = mediaIds.slice(idx * 4, (idx + 1) * 4).map((id) => merge({}, media[id], { id }));

      return (
        <GalleryRow
          key={idx}
          mediaList={subMediaList}
          isFetching={isFetching}
          deleteMedia={deleteMedia}
        />
      );
    });
  }

  render() {
    const {
      media,
      mediaIds,
      hasNext,
      isFetching,
      deleteMedia
    } = this.props;
    const rows = this.renderRows(media, mediaIds, isFetching, deleteMedia);

    return(
      <div className="gallery-component container content">
        <div className="row marrgin-bottom-30">
          {rows}
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
