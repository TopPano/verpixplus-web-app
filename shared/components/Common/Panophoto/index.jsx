'use strict';

import React, { Component, PropTypes } from 'react';
import isNumber from 'lodash/isNumber';
import merge from 'lodash/merge';

import { EMBED } from 'constants/common';

if (process.env.BROWSER) {
  require('./Panophoto.css');
}

const propTypes = {
  mediaId: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.object.isRequired),
  width: PropTypes.number,
  height: PropTypes.number,
  initialLng: PropTypes.number,
  initialLat: PropTypes.number
};

const defaultProps = {
  mediaId: '',
  images: [],
  width: EMBED.DEFAULT_WIDTH_PANOPHOTO,
  height: EMBED.DEFAULT_HEIGHT_PANOPHOTO
};

class Panophoto extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.getCurrentCoordinates = this.getCurrentCoordinates.bind(this);
    this.getCurrentSnapshot = this.getCurrentSnapshot.bind(this);
  }

  createPanophoto() {
    if (!this.instance) {
      const {
        mediaId,
        images,
        width,
        height,
        initialLng,
        initialLat
      } = this.props;
      const source =
        (images.length > 0) ? images :
        mediaId ? mediaId :
        null;
      let params = {
        width,
        height
      };

      params = !isNumber(initialLng) ? params : merge({}, params, { initialLng });
      params = !isNumber(initialLat) ? params : merge({}, params, { initialLat });

      window.verpix.createPanophoto(source, params, (err, instance) => {
        if (err) {
          // TODO: Error handling
        } else {
          instance.start();
          this.instance = instance;
          this.refs.panophoto.appendChild(instance.root);
        }
      });
    }
  }

  destroyPanophoto() {
    if (this.instance) {
      this.instance.stop();
      this.refs.panophoto.removeChild(this.instance.root);
      this.instance = null;
    }
  }

  getCurrentCoordinates() {
    if (!this.instance) {
      return {
        lng: 0,
        lat: 0
      }
    }

    return this.instance.getCurrentCoordinates();
  }

  getCurrentSnapshot(params) {
    if (!this.instance) {
      return 'data:image/jpeg;base64,';
    }

    return this.instance.getCurrentSnapshot(params);
  }

  componentDidMount() {
    this.createPanophoto();
  }

  componentDidUpdate(prevProps) {
    if (this.instance) {
      const {
        width,
        height
      } = this.props;

      if ((width !== prevProps.width) || (height !== prevProps.height)) {
        this.instance.setVisibleSize(width, height);
      }
    }
  }

  componentWillUnmount() {
    this.destroyPanophoto();
  }

  render() {
    return (
      <div
        ref="panophoto"
        className="panophoto-component"
      />
    );
  }
}

Panophoto.propTypes = propTypes;
Panophoto.defaultProps = defaultProps;

export default Panophoto;
