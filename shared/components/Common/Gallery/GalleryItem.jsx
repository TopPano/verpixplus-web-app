'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Line } from 'rc-progress';
import range from 'lodash/range';

import CONTENT from 'content/workspace/en-us.json';
import { DEFAULT_TITLE } from 'constants/common';
import { GALLERY_ITEM_TYPE } from 'constants/workspace';
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
  '#72C02C',
  '#79D5B3',
  '#3498DB',
  '#9B6BCC'
];

class GalleryItem extends Component {
  constructor(props) {
    super(props);
  }

  // Select images for feeding to Preview component
  selectPreviewImages(mediaObj, id) {
    const {
      count,
      cdnUrl,
      shardingKey,
      quality
    } = mediaObj.content;
    const selectedQuality = quality[quality.length - 1];
    const imgUrlPrefix = `${cdnUrl}${shardingKey}/media/${id}/live/${selectedQuality}`;

    if (count < 5) {
      return range(0, count).map((idx) => `${imgUrlPrefix}/${idx}.jpg`);
    } else {
      const step = parseInt(count / 5, 10);
      return range(0, 5).map((idx) => `${imgUrlPrefix}/${idx * step}.jpg`);
    }
  }

  // Render create view
  renderCreateView() {
    return (
      <Link
        to="/upload"
        className="gallery-item-create container-center-row fill clickable rounded"
      >
        <i className="fa fa-plus-circle" />
        <h5><strong>New</strong></h5>
      </Link>
    );
  }

  // Render progress view
  renderProgressView(progress) {
    const percent = parseInt(progress * 100, 10);
    const colorIdx = parseInt(progress * COLOR_MAP.length, 10);
    const color = COLOR_MAP[colorIdx];

    return (
      <div className="gallery-item-progress container-center-row fill rounded">
        <h6><strong>{`${percent}% ${CONTENT.COMPLETE}`}</strong></h6>
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
      isFetching
    } = this.props;
    const {
      title,
      caption,
      dimension,
      isVideoCreated,
      progress
    } = mediaObj;
    const link = `/edit/@${id}`;
    const selectedPreviewImages =
      (type !== GALLERY_ITEM_TYPE.COMPLETED) ?
      [] :
      this.selectPreviewImages(mediaObj, id);
    const createView =
      type === GALLERY_ITEM_TYPE.CREATE ?
      this.renderCreateView(progress) :
      null;
    const progressView =
      type === GALLERY_ITEM_TYPE.PROGRESS ?
      this.renderProgressView(progress) :
      null;

    return(
      <div className="gallery-item-component col-md-3 col-sm-6 col-xs-12">
        <div className="thumbnails thumbnail-style rounded">
          <div className="caption">
            <h3 className="text-single-line">
              <strong>
                <Link
                  className="hover-effect"
                  to={link}
                >
                  {title ? title : DEFAULT_TITLE}
                </Link>
              </strong>
            </h3>
            {
              caption ?
              <p className="text-single-line">{caption}</p> :
              <p className="text-single-line" ><br /></p>
            }
          </div>
          <Link to={link}>
            <Preview
              images={selectedPreviewImages}
              dimension={dimension}
            />
          </Link>
          <div className="thumbnail-tools">
            <ShareModal
              mediaId={id}
              title={title}
              isVideoCreated={Boolean(isVideoCreated)}
              isProcessing={isFetching}
            >
              <i className="fa fa-share-square-o clickable" />
            </ShareModal>
            <DeleteModal
              mediaId={id}
              isProcessing={isFetching}
            >
              <i className="fa fa-trash-o clickable" />
            </DeleteModal>
          </div>
          { createView }
          { progressView }
        </div>
      </div>
    );
  }
}

GalleryItem.propTypes = propTypes;
GalleryItem.defaultProps = defaultProps;

export default GalleryItem;
