'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import range from 'lodash/range';

import { DEFAULT_TITLE } from 'constants/common';
import Preview from './Preview';

if (process.env.BROWSER) {
  require('./GalleryItem.css');
}

const propTypes = {
  mediaObj: PropTypes.object.isRequired,
  deleteMedia: PropTypes.func.isRequired
};

const defaultProps = {
};

class GalleryItem extends Component {
  constructor(props) {
    super(props);
  }

  // Select images for feeding to Preview component
  selectPreviewImages(mediaObj) {
    const { id } = mediaObj;
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
    const { mediaObj } = this.props;
    const {
      id,
      title,
      caption,
      dimension
    } = mediaObj;
    const link = `/edit/@${id}`;
    const selectedPreviewImages = this.selectPreviewImages(mediaObj);

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
            <i className="fa fa-share-square-o clickable" />
            <i className="fa fa-trash-o clickable" />
          </div>
        </div>
      </div>
    );
  }
}

GalleryItem.propTypes = propTypes;
GalleryItem.defaultProps = defaultProps;

export default GalleryItem;
