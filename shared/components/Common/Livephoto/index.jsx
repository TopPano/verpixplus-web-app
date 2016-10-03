'use strict';

import React, { Component, PropTypes } from 'react';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';

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
  photos: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  filters: PropTypes.object.isRequired
};

const defaultProps = {
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

  // Create a livephoto instance
  setup(livephoto, photos, filters) {
    if (isArray(photos) && photos.length > 0) {
      this.setState({
        setupProgress: SETUP_PROGRESS.SETTING
      });

      const params = {
        filters
      };

      window.verpix.createLivephoto(photos, params, (err, instance) => {
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
      const {
        photos,
        filters
      } = this.props;
      const { livephoto } = this.refs;

      this.setup(livephoto, photos, filters);
    }
  }


  // Update the livephoto instance after re-rending.
  componentDidUpdate(prevProps) {
    if (process.env.BROWSER) {
      const { setupProgress } = this.state;

      if (setupProgress === SETUP_PROGRESS.INIT) {
        // In componentDidMount,
        // livephoto instance may not be created if photos is empty array,
        // so we should try to create it again in such case.
        const {
          photos,
          filters
        } = this.props;
        const { livephoto } = this.refs;

        this.setup(livephoto, photos, filters);
      } else if (setupProgress === SETUP_PROGRESS.SETTING) {
        this.setupCallback = () => {
          this.updateLivephoto(prevProps);
        };
      } else if (setupProgress === SETUP_PROGRESS.DONE) {
        this.updateLivephoto(prevProps);
      } else {
        // TODO: What to do for other cases ?
      }
    }
  }

  // Only update photos only when the length of them is changed,
  // to prevent overwhelmingly update.
  // FIXME:
  // It may comsume time but be accurate to compare photos bytes by bytes,
  // how do we choose between accuracy and time consumption ?
  shouldUpdatePhotos(oldPhotos, newPhotos) {
    return oldPhotos.length !== newPhotos.length;
  }

  // Only update filters only when the they are changed,
  // to prevent overwhelmingly update.
  shouldUpdateFilters(oldFilters, newFilters) {
    return !isEqual(oldFilters, newFilters);
  }

  // Update livephoto instance
  updateLivephoto(prevProps) {
    const {
      photos,
      filters
    } = this.props;

    if (this.shouldUpdatePhotos(prevProps.photos, photos)) {
      this.instance.setPhotos(photos);
    }
    if (this.shouldUpdateFilters(prevProps.filters, filters)) {
      this.instance.applyFilters(filters);
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
