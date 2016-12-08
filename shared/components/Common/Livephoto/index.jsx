'use strict';

import React, { Component, PropTypes } from 'react';

import { EMBED } from 'constants/common';

if (process.env.BROWSER) {
  require('./Livephoto.css');
}

const propTypes = {
  mediaId: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  cutBased: PropTypes.string
};

const defaultProps = {
  mediaId: '',
  width: EMBED.DEFAULT_WIDTH_LIVEPHOTO,
  height: EMBED.DEFAULT_HEIGHT_LIVEPHOTO,
  cutBased: 'width'
};

class Livephoto extends Component {
  constructor(props) {
    super(props);
  }

  createLivephoto() {
    if (!this.instance) {
      const {
        mediaId,
        width,
        height,
        cutBased
      } = this.props;
      const params = {
        width,
        height,
        cutBased
      };

      window.verpix.createLivephoto(mediaId, params, (err, instance) => {
        if (err) {
          // TODO: Error handling
        } else {
          instance.start();
          this.instance = instance;
          this.refs.livephoto.appendChild(instance.root);
        }
      });
    }
  }

  destroyLivephoto() {
    if (this.instance) {
      this.instance.stop();
      this.refs.livephoto.removeChild(this.instance.root);
      this.instance = null;
    }
  }

  componentDidMount() {
    this.createLivephoto();
  }

  componentDidUpdate(prevProps) {
    if (this.instance) {
      const {
        width,
        height,
        cutBased
      } = this.props;

      if ((width !== prevProps.width) || (height !== prevProps.height)) {
        this.instance.setWrapperDimension({
          width,
          height
        });
      }

      if (cutBased !== prevProps.cutBased) {
        this.destroyLivephoto();
        this.createLivephoto();
      }
    }
  }

  componentWillUnmount() {
    this.destroyLivephoto();
  }

  render() {
    const {
      width,
      height
    } = this.props;
    const ratio = Math.round((height / width) * 100);
    const componentStyle = {
      width: `${width}px`
    };
    const outerStyle = {
      paddingBottom: `${ratio}%`
    };

    return (
      <div
        style={componentStyle}
        className="livephoto-component"
      >
        <div
          style={outerStyle}
          className="livephoto-outer"
        >
          <div
            ref="livephoto"
            className="livephoto-inner"
          />
        </div>
      </div>
    );
  }
}

Livephoto.propTypes = propTypes;
Livephoto.defaultProps = defaultProps;

export default Livephoto;
