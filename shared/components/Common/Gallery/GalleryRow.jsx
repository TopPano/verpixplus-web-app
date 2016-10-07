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
    return renderList(mediaList.slice(0, 4), (mediaObj, idx) => {
      const { id } = mediaObj;
      const {
        cdnUrl,
        shardingKey
      } = mediaObj.content;
      const imgUrl = `${cdnUrl}/${shardingKey}/media/${id}/live/thumb.jpg`;

      return (
        <GalleryItem
          key={id}
          id={id}
          title={mediaObj.title}
          caption={idx === 0 ? 'yoyo' : mediaObj.caption}
          image={imgUrl}
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
