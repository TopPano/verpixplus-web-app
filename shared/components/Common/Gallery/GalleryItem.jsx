'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Line } from 'rc-progress';

import CONTENT from 'content/workspace/en-us.json';
import { DEFAULT_TITLE } from 'constants/common';
import { GALLERY_ITEM_TYPE } from 'constants/workspace';
import { getReadableDuration } from 'lib/utils';
import ShareModal from 'containers/common/ShareModal';
import DeleteModal from 'containers/common/DeleteModal';
import Preview from './Preview';

if (process.env.BROWSER) {
  require('./GalleryItem.css');
}

const propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  mediaObj: PropTypes.object.isRequired,
  isProcessing: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  deleteMedia: PropTypes.func.isRequired
};

const defaultProps = {
};

const COLOR_MAP = [
  '#C1272D',
  '#C22D40',
  '#DC143C'
];

class GalleryItem extends Component {
  constructor(props) {
    super(props);
  }

  getCoverPhoto(mediaObj, id) {
    const {
      cdnUrl,
      shardingKey
    } = mediaObj.content;

    return `${cdnUrl}${shardingKey}/media/${id}/live/thumb.jpg`;
  }

  // Render create view
  renderCreateMain() {
    return (
      <div className="create-main container-center-row">
        <p className="text-center">{CONTENT.CREATE.MAIN}</p>
      </div>
    );
  }

  // Render progress view
  renderProgressView(progress) {
    const percent = parseInt(progress * 100, 10);
    const colorIdx = parseInt(progress * COLOR_MAP.length, 10);
    const color = COLOR_MAP[colorIdx];

    return (
      <div className="gallery-item-progress container-center-row fill">
        <p>{`${percent}% ${CONTENT.COMPLETE}`}</p>
        <Line
          percent={percent}
          strokeColor={color}
          strokeWidth={4}
          trailWidth={4}
        />
      </div>
    );
  }

  render() {
    const {
      id,
      mediaObj,
      type,
      isProcessing,
      isFetching
    } = this.props;
    const {
      title,
      created,
      dimension,
      isVideoCreated,
      videoUrl,
      progress
    } = mediaObj;
    const readableDuration = getReadableDuration(created);
    const link =
      type === GALLERY_ITEM_TYPE.COMPLETED ? `/edit/@${id}` :
      type === GALLERY_ITEM_TYPE.CREATE ? '/upload' :
      '';
    const coverPhoto =
      type === GALLERY_ITEM_TYPE.COMPLETED ? this.getCoverPhoto(mediaObj, id) :
      type === GALLERY_ITEM_TYPE.CREATE ? '/static/images/workspace/cover-photo-create.jpg' :
      '';
    const createMain =
      type === GALLERY_ITEM_TYPE.CREATE ?
      this.renderCreateMain() :
      null;
    const progressView =
      type === GALLERY_ITEM_TYPE.PROGRESS ?
      this.renderProgressView(progress) :
      null;

    return(
      <div className="gallery-item-component col-md-3 col-sm-4 col-xs-6">
        <div className="thumbnails thumbnail-style">
          <Link to={link}>
            <Preview
              image={coverPhoto}
              type={type}
              dimension={dimension}
            />
          </Link>
          <div className="thumbnails-main">
            <p className="title">{title ? title : DEFAULT_TITLE}</p>
            <div className="thumbnails-toolsbar">
              <p className="time text-center">{readableDuration}</p>
              <div className="tools">
                <ShareModal
                  mediaId={id}
                  title={title}
                  isVideoCreated={Boolean(isVideoCreated)}
                  videoUrl={videoUrl}
                  dimension={dimension}
                  isProcessing={isProcessing}
                >
                  <div className="tool tool-share circle clickable" />
                </ShareModal>
                <Link to={link}>
                  <div className="tool tool-edit circle clickable" />
                </Link>
                <DeleteModal
                  mediaId={id}
                  isProcessing={isFetching}
                >
                  <div className="tool tool-delete circle clickable" />
                </DeleteModal>
              </div>
            </div>
            { createMain }
          </div>
          { progressView }
        </div>
      </div>
    );
  }
}

GalleryItem.propTypes = propTypes;
GalleryItem.defaultProps = defaultProps;

export default GalleryItem;
