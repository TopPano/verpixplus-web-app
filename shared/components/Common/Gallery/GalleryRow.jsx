'use strict';

import React, { Component, PropTypes } from 'react';

import { renderList } from 'lib/utils';
import GalleryItem from './GalleryItem';

if (process.env.BROWSER) {
  require('./GalleryRow.css');
}

const propTypes = {
  mediaList: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  deleteMedia: PropTypes.func.isRequired
};

const defaultProps = {
};

class GalleryRow extends Component {
  constructor(props) {
    super(props);
  }

  // Render list of gallery items
  renderItemsList(mediaList, deleteMedia) {
    return renderList(mediaList.slice(0, 4), (mediaObj) => {
      const { id } = mediaObj;

      return (
        <GalleryItem
          key={id}
          mediaObj={mediaObj}
          deleteMedia={deleteMedia}
        />
      );
    });
  }

  render() {
    const {
      mediaList,
      deleteMedia
    } = this.props;
    const itemsList = this.renderItemsList(mediaList, deleteMedia);

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
