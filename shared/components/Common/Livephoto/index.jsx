'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Livephoto.css');
}

const propTypes = {
  mediaId: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

const defaultProps = {
  mediaId: '',
  width: 0,
  height: 0
};

class Livephoto extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { mediaId } = this.props;

    window.verpix.createLivephoto(mediaId, {}, (err, instance) => {
      if (err) {
        // TODO: Error handling
      } else {
        const {
          width,
          height
        } = this.props;

        instance.setWrapperDimension({
          width,
          height
        });
        instance.start();
        this.instance = instance;
        this.refs.livephoto.appendChild(instance.root);
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.instance) {
      const {
        width,
        height
      } = this.props;

      if ((width !== prevProps.width) || (height !== prevProps.height)) {
        this.instance.setWrapperDimension({
          width,
          height
        });
      }
    }
  }

  componentWillUnmount() {
    if (this.instance) {
      this.instance.stop();
        this.refs.livephoto.removeChild(this.instance.root);
    }
  }

  render() {
    return (
      <div
        ref="livephoto"
        className="livephoto-component"
      >
      </div>
    );
  }
}

Livephoto.propTypes = propTypes;
Livephoto.defaultProps = defaultProps;

export default Livephoto;
