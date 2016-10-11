'use strict';

import React, { Component, PropTypes } from 'react';

import { renderList } from 'lib/utils';
import GalleryItem from './GalleryItem';

if (process.env.BROWSER) {
  require('./GalleryRow.css');
}

const propTypes = {
  mediaList: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  isFetching: PropTypes.bool.isRequired,
  deleteMedia: PropTypes.func.isRequired
};

const defaultProps = {
};

class GalleryRow extends Component {
  constructor(props) {
    super(props);
  }

  // Render list of gallery items
  renderItemsList(mediaList, isFetching, deleteMedia) {
    return renderList(mediaList.slice(0, 4), (mediaObj) => {
      const { id } = mediaObj;

      return (
        <GalleryItem
          key={id}
          mediaObj={mediaObj}
          isFetching={isFetching}
          deleteMedia={deleteMedia}
        />
      );
    });
  }

  render() {
    const {
      mediaList,
      isFetching,
      deleteMedia
    } = this.props;
    const itemsList = this.renderItemsList(mediaList, isFetching, deleteMedia);

    return(
      <div className="gallery-row-component row">
        {itemsList}
      </div>
    );
  }
}

GalleryRow.propTypes = propTypes;
GalleryRow.defaultProps = defaultProps;

export default GalleryRow;
