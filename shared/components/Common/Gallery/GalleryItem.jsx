'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Line } from 'rc-progress';

import {
  MEDIA_TYPE,
  DEFAULT_TITLE
} from 'constants/common';
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
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);
  }

  // Get cover photo of media
  getCoverPhoto(mediaObj, id) {
    const {
      storeUrl,
      shardingKey
    } = mediaObj.content;
    const typeName = (mediaObj.type === MEDIA_TYPE.LIVE_PHOTO) ? 'live' : 'pano';

    return `${storeUrl}${shardingKey}/media/${id}/${typeName}/thumb.jpg`;
  }

  // Get panophoto for sharing
  getPanoSharedPhoto(mediaObj, id) {
    const {
      cdnUrl,
      shardingKey
    } = mediaObj.content;

    return (
      (mediaObj.type === MEDIA_TYPE.PANO_PHOTO) ?
      `${cdnUrl}${shardingKey}/media/${id}/pano/share.jpg` :
      ''
    );
  }


  // Get approximate duration from created time to now
  getApproximateDuration(created) {
    const { l, getLocale } = this.context.i18n;

    const readableDuration = getReadableDuration(created, getLocale());
    const approximateDuration = readableDuration.split(',')[0];

    return `${approximateDuration} ${l('ago')}`;
  }

  // Render create view
  renderCreateMain() {
    const { l } = this.context.i18n;

    return (
      <div className="create-main container-center-row">
        <p className="text-center">{l('Create your own imagination')}</p>
      </div>
    );
  }

  // Render progress view
  renderProgressView(progress) {
    const { l } = this.context.i18n;
    const percent = parseInt(progress * 100, 10);
    const colorIdx = parseInt(progress * COLOR_MAP.length, 10);
    const color = COLOR_MAP[colorIdx];

    return (
      <div className="gallery-item-progress container-center-row fill">
        <p>{`${percent}% ${l('Complete')}`}</p>
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
    const { l } = this.context.i18n;
    const {
      id,
      mediaObj,
      type,
      isFetching
    } = this.props;
    const {
      title,
      created,
      dimension,
      progress
    } = mediaObj;
    const approximateDuration = this.getApproximateDuration(created);
    const link =
      type === GALLERY_ITEM_TYPE.COMPLETED ? `/edit/@${id}` :
      type === GALLERY_ITEM_TYPE.CREATE ? '/upload' :
      '';
    const coverPhoto =
      type === GALLERY_ITEM_TYPE.COMPLETED ? this.getCoverPhoto(mediaObj, id) :
      type === GALLERY_ITEM_TYPE.CREATE ? '/static/images/workspace/cover-photo-create.svg' :
      '';
    const panoSharedPhoto =
      type === GALLERY_ITEM_TYPE.COMPLETED ? this.getPanoSharedPhoto(mediaObj, id) : '';
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
              mediaType={mediaObj.type}
              dimension={dimension}
            />
          </Link>
          <div className="thumbnails-main">
            <p className="title">{title ? title : l(DEFAULT_TITLE)}</p>
            <div className="thumbnails-toolsbar">
              <p className="time text-center">{approximateDuration}</p>
              <div className="tools">
                <ShareModal
                  mediaId={id}
                  mediaType={mediaObj.type}
                  title={title}
                  panoSharedPhoto={panoSharedPhoto}
                  altPhotoUrl={coverPhoto}
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
