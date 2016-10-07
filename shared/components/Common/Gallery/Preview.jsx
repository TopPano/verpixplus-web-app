'use strict';

import React, { Component, PropTypes } from 'react';
import { renderList } from 'lib/utils';

if (process.env.BROWSER) {
  require('./Preview.css');
}

const propTypes = {
  images: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired
};

const defaultProps = {
};

class Preview extends Component {
  constructor(props) {
    super(props);
  }

  // Render items list
  renderItemsList(images, dimension) {
    let imgClass;
    let imgStyle;

    if (dimension.width <= dimension.height) {
      // portrait
      imgClass = 'img-portrait';
      imgStyle = {
        width: '100%',
        height: `${parseInt((dimension.height / dimension.width) * 100, 10)}%`
      };
    } else {
      // landscape
      imgClass = 'img-landscape';
      imgStyle = {
        width: `${parseInt((dimension.width / dimension.height) * 100, 10)}%`,
        height: '100%'
      };
    }

    return renderList(images.slice(0, 5), (image, idx) => (
      <div
        className="img-item"
        key={idx}
      >
        <div className="img-wrapper overflow-hidden rounded">
          <img
            className={imgClass}
            style={imgStyle}
            src={image}
            alt=""
          />
        </div>
      </div>
    ));
  }

  render() {
    const {
      images,
      dimension
    } = this.props;

    const itemsList = this.renderItemsList(images, dimension);

    return (
      <div className="preview-component overflow-hidden">
        <div className="preview-wrapper">
          <div className="preview-primary">
            {itemsList[0]}
          </div>
          <div className="preview-secondary">
            {itemsList.slice(1, 5)}
          </div>
        </div>
        <div className="preview-overlay container-center-row rounded">
          <i className="fa fa-pencil" />
        </div>
      </div>
    );
  }
}

Preview.propTypes = propTypes;
Preview.defaultProps = defaultProps;

export default Preview;
