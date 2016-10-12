'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import range from 'lodash/range';

import { DEFAULT_TITLE } from 'constants/common';
import CONTENT from 'content/workspace/en-us.json';
import Modal from 'components/Common/Modal';
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

    // Bind "this" to member functions
    this.openModalDelete = this.openModalDelete.bind(this);
    this.handleClickModalDeleteBtn = this.handleClickModalDeleteBtn.bind(this);
  }

  // Open the modal for deletion
  openModalDelete() {
    if (!this.props.isFetching) {
      this.refs.modalDelete.open();
    }
  }

  // Handler for clicking delete button
  handleClickModalDeleteBtn() {
    const {
      id,
      deleteMedia
    } = this.props;

    deleteMedia({
      mediaId: id
    });
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
      dimension
    } = mediaObj;
    const link = `/edit/@${id}`;
    const selectedPreviewImages = isCreator ? [] : this.selectPreviewImages(mediaObj, id);
    const modalDeleteProps = {
      ref: 'modalDelete',
      title: CONTENT.DELETE.TITLE,
      closeBtn: {
        text: CONTENT.DELETE.CLOSE_BTN
      },
      confirmBtn: {
        icon: 'trash',
        className: 'btn btn-u btn-u-red pull-right rounded',
        text: CONTENT.DELETE.CONFIRM_BTN,
        onClick: this.handleClickModalDeleteBtn
      },
      isProcessing: isFetching
    };

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
            <i
              className="fa fa-trash-o clickable"
              onClick={this.openModalDelete}
            />
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
        <Modal {...modalDeleteProps}>
          <div>{CONTENT.DELETE.DESC}</div>
        </Modal>
      </div>
    );
  }
}

GalleryItem.propTypes = propTypes;
GalleryItem.defaultProps = defaultProps;

export default GalleryItem;
