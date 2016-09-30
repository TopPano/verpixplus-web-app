'use strict';

import React, { Component, PropTypes } from 'react';
import inRange from 'lodash/inRange';

import { PLAYER_MODE } from 'constants/editor';

if (process.env.BROWSER) {
  require('./LivephotoPlayer.css');
}

const PLAY_DIRECTION = {
  // From small to large index
  INCREASE: 'INCREASE',
  // From large to small index
  DECREASE: 'DECREASE'
};
// Number of frames per second
const PLAY_RATE = 20;
// The duration for showing loading overlay
const LOADING_DURATION = 500;

const propTypes = {
  imagesData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  playerMode: PropTypes.string.isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired
};

const defaultProps = {
};

class LivephotoPlayer extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      currentIdx: -1,
      playDirection: PLAY_DIRECTION.INCREASE,
      isLoading: false
    };
  }

  componentDidMount() {
    const {
      playerMode,
      lower
    } = this.props;

    if (playerMode === PLAYER_MODE.PLAY) {
      this.play(lower);
    }
  }

  componentDidUpdate(prevProps) {
    const { currentIdx } = this.state;
    const {
      imagesData,
      playerMode,
      lower
    } = this.props;

    this.renderImageByIndex(imagesData, currentIdx);

    if (prevProps.playerMode === PLAYER_MODE.PAUSE
        && playerMode === PLAYER_MODE.PLAY) {
      this.play(lower);
    } else if (prevProps.playerMode === PLAYER_MODE.PLAY
              && playerMode === PLAYER_MODE.PAUSE) {
      this.pause();
    }
  }

  componentWillUnmount() {
    this.pause();
  }

  // Start the player
  play(startIdx) {
    this.setState({
      isLoading: true
    });

    this.loadingTimer = setTimeout(() => {
      this.setState({
        isLoading: false
      });

      this.startPlay(startIdx);
    }, LOADING_DURATION);
  }

  // Start playting
  startPlay(startIdx) {
    this.setState({
      currentIdx: startIdx,
      playDirection: PLAY_DIRECTION.INCREASE
    });

    this.player = setInterval(() => {
      const {
        currentIdx,
        playDirection
      } = this.state;
      const {
        lower,
        upper
      } = this.props;
      let newIdx;
      let newPlayDirection = playDirection;

      if (playDirection === PLAY_DIRECTION.INCREASE) {
        if (currentIdx === (upper - 1)) {
          newIdx = currentIdx - 1;
          newPlayDirection = PLAY_DIRECTION.DECREASE;
        } else {
          newIdx = currentIdx + 1;
        }
      } else {
        if (currentIdx === lower) {
          newIdx = currentIdx + 1;
          newPlayDirection = PLAY_DIRECTION.INCREASE;
        } else {
          newIdx = currentIdx - 1;
        }
      }

      this.setState({
        currentIdx: newIdx,
        playDirection: newPlayDirection
      });
    }, 1000 / PLAY_RATE);
  }

  // Pause the player
  pause() {
    clearInterval(this.player);
    clearInterval(this.loadingTimer);
    this.setState({
      isLoading: false
    });
  }

  // Render an selected image from of images
  renderImageByIndex(imagesData, idx) {
    if (inRange(idx, 0, imagesData.length)) {
      this.renderImage(imagesData[idx]);
    }
  }

  // Render an image to canvas
  renderImage(imageData) {
    this.refs.canvas.getContext('2d').putImageData(imageData, 0, 0);
  }

  render() {
    const { isLoading } = this.state;
    const { dimension } = this.props;
    const componentStyle = {
      width: `${dimension.width}px`,
      height: `${dimension.height}px`
    };

    return (
      <div
        className="livephoto-player-component"
        style={componentStyle}
      >
        <canvas ref="canvas" />
        {
          isLoading &&
          <div className="loading-overlay container-center-row">
            <img
              src="/static/images/loading-ring.svg"
              alt="loading-ring"
            />
          </div>
        }
      </div>
    );
  }
}

LivephotoPlayer.propTypes = propTypes;
LivephotoPlayer.defaultProps = defaultProps;

export default LivephotoPlayer;
