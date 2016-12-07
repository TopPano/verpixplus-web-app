'use strict';

import React, { Component, PropTypes } from 'react';

import Panophoto from 'components/Common/Panophoto';

if (process.env.BROWSER) {
  require('./PanophotoPlayer.css');
}

const propTypes = {
  images: PropTypes.arrayOf(PropTypes.object.isRequired),
  setPanophotoFunctions: PropTypes.func.isRequired
};

const defaultProps = {
};

class PanophotoPlayer extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      panophotoDimension: null,
      hasSetPanoFuncs: false
    };
  }

  componentDidMount() {
    const parentWidth = this.refs.panophotoPlayer.parentNode.clientWidth - 40;
    const parentHeight = this.refs.panophotoPlayer.parentNode.clientHeight - 15;
    const length = (parentWidth < parentHeight) ? parentWidth : parentHeight;

    this.setState({
      panophotoDimension: {
        width: length,
        height: length
      }
    });
  }

  componentDidUpdate() {
    if (!this.state.hasSetPanoFuncs && this.refs.panophoto) {
      this.setState({
        hasSetPanoFuncs: true
      });
      this.props.setPanophotoFunctions({
        getPanophotoCoordinates: this.refs.panophoto.getCurrentCoordinates,
        getPanophotoSnapshot: this.refs.panophoto.getCurrentSnapshot
      });
    }
  }

  render() {
    const { images } = this.props;
    const { panophotoDimension } = this.state;

    return (
      <div
        ref="panophotoPlayer"
        className="panophoto-player-component"
      >
        {
          panophotoDimension &&
          (images.length > 0) &&
          <Panophoto
            ref="panophoto"
            images={images}
            width={panophotoDimension.width}
            height={panophotoDimension.height}
          />
        }
      </div>
    );
  }
}

PanophotoPlayer.propTypes = propTypes;
PanophotoPlayer.defaultProps = defaultProps;

export default PanophotoPlayer;
