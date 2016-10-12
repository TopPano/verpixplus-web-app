'use strict';

import React, { Component, PropTypes } from 'react';

import CONTENT from 'content/workspace/en-us.json';
import IconButton from 'components/Common/IconButton';
import Loading from 'components/Common/Loading';
import GalleryItem from './GalleryItem';

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

  // Render list of gallery items
  renderItems(media, mediaIds, isFetching, deleteMedia) {
    const items = mediaIds.map((id) => (
      <GalleryItem
        key={id}
        id={id}
        mediaObj={media[id]}
        isFetching={isFetching}
        deleteMedia={deleteMedia}
      />
    ));
    items.unshift(
      <GalleryItem
        key="item-create"
        id=""
        mediaObj={{}}
        isFetching={isFetching}
        isCreator={true}
        deleteMedia={deleteMedia}
      />
    );

    return items;
  }

  render() {
    const {
      media,
      mediaIds,
      hasNext,
      isFetching,
      deleteMedia,
      loadMore
    } = this.props;
    const remainder = (mediaIds.length + 1) % 4;
    const renderAll = !hasNext || (remainder === 0);
    const items =
      renderAll ?
      this.renderItems(media, mediaIds, isFetching, deleteMedia) :
      this.renderItems(media, mediaIds.slice(0, mediaIds.length - remainder), isFetching, deleteMedia);

    return (
      <div className="gallery-component container content">
        <div className="row marrgin-bottom-30">
          {items}
        </div>
        {
          hasNext &&
          <div className="text-center">
            {
              isFetching ?
              <Loading size={30} /> :
              <IconButton
                icon="arrow-down"
                className="btn btn-u btn-u-light-green"
                text={CONTENT.MORE}
                handleClick={loadMore}
              />
            }
          </div>
        }
      </div>
    );
  }
}

Gallery.propTypes = propTypes;
Gallery.defaultProps = defaultProps;

export default Gallery;
