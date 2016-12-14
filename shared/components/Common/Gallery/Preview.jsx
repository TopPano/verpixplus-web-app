'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { GALLERY_ITEM_TYPE } from 'constants/workspace';

if (process.env.BROWSER) {
  require('./Preview.css');
}

const propTypes = {
  image: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  })
};

const defaultProps = {
};

class Preview extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);
  }

  render() {
    const { l } = this.context.i18n;
    const {
      image,
      type,
      dimension
    } = this.props;
    let imgClass = '';

    if (dimension) {
      const {
        width,
        height
      } = dimension;

      imgClass = classNames({
        portrait: width <= height,
        landscape: width > height
      });
    }

    return (
      <div className="preview-component">
        <div className="preview-wrapper overflow-hidden">
          <img
            className={imgClass}
            src={image}
          />
        </div>
        {
          type === GALLERY_ITEM_TYPE.COMPLETED &&
          <div className="preview-overlay container-center-row">
            <img
              src="/static/images/workspace/view.png"
              alt="view"
            />
          </div>
        }
        {
          type === GALLERY_ITEM_TYPE.CREATE &&
          <div className="preview-overlay container-center-row">
            <img
              src="/static/images/workspace/add.png"
              alt="view"
              width="25"
              height="25"
            />
            <p className="create-description text-center">{l('Upload your video / panorama')}</p>
          </div>
        }
      </div>
    );
  }
}

Preview.propTypes = propTypes;
Preview.defaultProps = defaultProps;

export default Preview;
