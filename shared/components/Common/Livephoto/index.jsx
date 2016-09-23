'use strict';

import React, { Component, PropTypes } from 'react';
import isArray from 'lodash/isArray';

import { execute } from 'lib/utils';

if (process.env.BROWSER) {
  require('./Livephoto.css');
}

const SETUP_PROGRESS = {
  INIT: 'INIT',
  SETTING: 'SETTING',
  DONE: 'DONE',
  ERR: 'ERR'
};

const propTypes = {
  photos: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};

const defaultProps = {
  photos: []
};

class Livephoto extends Component{
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      setupProgress: SETUP_PROGRESS.INIT,
      instance: null
    };
  }

  setup(livephoto, photos) {
    if (isArray(photos) && photos.length > 0) {
      this.setState({
        setupProgress: SETUP_PROGRESS.SETTING
      });

      window.verpix.createLivephoto(photos, {}, (err, instance) => {
        if (err) {
          this.setState({
            setupProgress: SETUP_PROGRESS.ERR
          });
        } else {
          instance.start();
          livephoto.appendChild(instance.root);
          this.instance = instance;

          if (this.setupCallback) {
            execute(this.setupCallback);
          }

          this.setState({
            setupProgress: SETUP_PROGRESS.DONE
          });
        }
      });
    }
  }

  // Create a livephoto instance when component is mounted.
  componentDidMount() {
    if (process.env.BROWSER) {
      const { photos } = this.props;
      const { livephoto } = this.refs;

      this.setup(livephoto, photos);
    }
  }

  // Only update when the length of photos is change, to prevent overwhelming update.
  // FIXME:
  // It may comsume time but accurate to compare photos bytes by bytes,
  // how do we choose between accuracy and time consumption ?
  shouldComponentUpdate(nextProps) {
    return this.props.photos.length !== nextProps.photos.length;
  }

  // Update photos of the livephoto instance after re-rending.
  componentDidUpdate() {
    if (process.env.BROWSER) {
      const { setupProgress } = this.state;
      const { photos } = this.props;
      const { livephoto } = this.refs;

      if (setupProgress === SETUP_PROGRESS.INIT) {
        // In componentDidMount,
        // livephoto instance may not be created if photos is empty array,
        // so we should try to create it again in such case.
        this.setup(livephoto, photos);
      } else if (setupProgress === SETUP_PROGRESS.SETTING) {
        this.setupCallback = () => {
          this.instance.setPhotos(photos);
        };
      } else if (setupProgress === SETUP_PROGRESS.DONE) {
        this.instance.setPhotos(photos);
      } else {
        // TODO: What to do for other cases ?
      }
    }
  }

  render() {
    return (
      <div
        className="livephoto-component"
        ref="livephoto"
      />
    );
  }
}

Livephoto.propTypes = propTypes;
Livephoto.defaultProps = defaultProps;

export default Livephoto;
