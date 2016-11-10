'use strict';

import React, { Component, PropTypes } from 'react';

import { GALLERY_ITEM_TYPE } from 'constants/workspace';
import CONTENT from 'content/workspace/en-us.json';
import IconButton from 'components/Common/IconButton';
import Loading from 'components/Common/Loading';
import GalleryItem from './GalleryItem';

if (process.env.BROWSER) {
  require('./Gallery.css');
}

const propTypes = {
  progresMedia: PropTypes.object.isRequired,
  progressMediaIds: PropTypes.array.isRequired,
  media: PropTypes.object.isRequired,
  mediaIds: PropTypes.array.isRequired,
  hasNext: PropTypes.bool.isRequired,
  deleteMedia: PropTypes.func.isRequired,
  isProcessing: PropTypes.object.isRequired,
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
  renderItems(progressMedia, progressMediaIds, media, mediaIds, isProcessing, isFetching, deleteMedia) {
    let items = new Array();
    // Item for creation
    const createItem = (
      <GalleryItem
        key="item-create"
        id=""
        type={GALLERY_ITEM_TYPE.CREATE}
        mediaObj={{}}
        isProcessing={isProcessing}
        isFetching={isFetching}
        deleteMedia={deleteMedia}
      />
    );
    // Progressing Items
    const progressItems = progressMediaIds.map((id) => (
      <GalleryItem
        key={id}
        id={id}
        type={GALLERY_ITEM_TYPE.PROGRESS}
        mediaObj={progressMedia[id]}
        isProcessing={isProcessing}
        isFetching={isFetching}
        deleteMedia={deleteMedia}
      />
    ));
    // Completed items
    const completedItems = mediaIds.map((id) => (
      <GalleryItem
        key={id}
        id={id}
        type={GALLERY_ITEM_TYPE.COMPLETED}
        mediaObj={media[id]}
        isProcessing={isProcessing}
        isFetching={isFetching}
        deleteMedia={deleteMedia}
      />
    ));

    items.push(createItem);
    items = items.concat(progressItems);
    items = items.concat(completedItems);

    return items;
  }

  render() {
    const {
      media,
      mediaIds,
      progressMedia,
      progressMediaIds,
      hasNext,
      isFetching,
      isProcessing,
      deleteMedia,
      loadMore
    } = this.props;
    const numOfItems = progressMediaIds.length + mediaIds.length + 1;
    const remainder = numOfItems % 4;
    const renderAll = !hasNext || (remainder === 0);
    const slicedMediaIds =
      renderAll ? mediaIds : mediaIds.slice(0, mediaIds.length - remainder);
    const items =
      this.renderItems(progressMedia, progressMediaIds, media, slicedMediaIds, isProcessing, isFetching, deleteMedia);

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
