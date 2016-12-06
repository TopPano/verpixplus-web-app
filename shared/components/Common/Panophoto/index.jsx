'use strict';

import React, { Component, PropTypes } from 'react';

import { EMBED } from 'constants/common';

if (process.env.BROWSER) {
  require('./Panophoto.css');
}

const propTypes = {
  images: PropTypes.arrayOf(PropTypes.object.isRequired),
  width: PropTypes.number,
  height: PropTypes.number
};

const defaultProps = {
  images: [],
  width: EMBED.DEFAULT_WIDTH,
  height: EMBED.DEFAULT_HEIGHT
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
        images,
        width,
        height
      } = this.props;
      // TODO: source by using mediaId
      const source = images.length ? images : null;
      const params = {
        width,
        height
      };

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

  getCurrentSnapshot() {
    if (!this.instance) {
      return 'data:image/jpeg;base64,';
    }

    return this.instance.getCurrentSnapshot();
  }

  componentDidMount() {
    this.createPanophoto();
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
