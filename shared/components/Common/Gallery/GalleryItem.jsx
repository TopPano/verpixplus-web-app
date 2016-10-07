'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { DEFAULT_TITLE } from 'constants/common';

if (process.env.BROWSER) {
  require('./GalleryItem.css');
}

const propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  caption: PropTypes.string,
  image: PropTypes.string,
  deleteMedia: PropTypes.func
};

const defaultProps = {
  id: '',
  title: '',
  caption: '',
  image: '',
  deleteMedia: () => {}
};

class GalleryItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      id,
      title,
      caption,
      image
    } = this.props;
    const link = `/edit/@${id}`;

    return(
      <div className="gallery-item-component col-md-3 col-sm-6 col-xs-6">
        <div className="thumbnails thumbnail-style thumbnail-kenburn rounded">
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
          <div className="thumbnail-img container-center-row overflow-hidden">
            <Link to={link}>
              <img
                className="rounded"
                src={image}
                alt={title}
              />
            </Link>
          </div>
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
