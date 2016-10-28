'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import range from 'lodash/range';

import { DEFAULT_TITLE } from 'constants/common';
import ShareModal from 'containers/common/ShareModal';
import DeleteModal from 'containers/common/DeleteModal';
import Preview from './Preview';

if (process.env.BROWSER) {
  require('./GalleryItem.css');
}

const propTypes = {
  id: PropTypes.string.isRequired,
  mediaObj: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isCreator: PropTypes.bool,
  deleteMedia: PropTypes.func.isRequired
};

const defaultProps = {
  isCreator: false
};

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

  render() {
    const {
      id,
      mediaObj,
      isCreator,
      isFetching
    } = this.props;
    const {
      title,
      caption,
      dimension,
      isVideoCreated
    } = mediaObj;
    const link = `/edit/@${id}`;
    const selectedPreviewImages = isCreator ? [] : this.selectPreviewImages(mediaObj, id);

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
          {
            isCreator &&
            <Link
              to="/upload"
              className="creator container-center-row fill clickable rounded"
            >
              <i className="fa fa-plus-circle" />
              <h5><strong>New</strong></h5>
            </Link>
          }
        </div>
      </div>
    );
  }
}

GalleryItem.propTypes = propTypes;
GalleryItem.defaultProps = defaultProps;

export default GalleryItem;
