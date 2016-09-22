'use strict';

import React, { Component, PropTypes } from 'react';

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

  componentDidMount() {
    if (process.env.BROWSER) {
      const { photos } = this.props;
      const { livephoto } = this.refs;

      this.setup(livephoto, photos);
    }
  }

  componentDidUpdate() {
    if (process.env.BROWSER) {
      const { setupProgress } = this.state;
      const { photos } = this.props;

      if (setupProgress === SETUP_PROGRESS.SETTING) {
        this.setupCallback = () => {
          this.instance.updatePhotos(photos);
        };
      } else if (setupProgress === SETUP_PROGRESS.DONE) {
        this.instance.updatePhotos(photos);
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
