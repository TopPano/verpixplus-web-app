'use strict';

import React, { Component, PropTypes } from 'react';
import inRange from 'lodash/inRange';
import isEqual from 'lodash/isEqual';

import { PLAYER_MODE } from 'constants/editor';
import { applyImageFilters } from 'lib/utils';

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
  storageId: PropTypes.string.isRequired,
  appliedData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  playerMode: PropTypes.string.isRequired,
  autoplay: PropTypes.bool.isRequired,
  lower: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired
};

const defaultProps = {
};

class LivephotoPlayer extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      parentDimension: null,
      currentIdx: -1,
      playDirection: PLAY_DIRECTION.INCREASE,
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({
      parentDimension: {
        width: this.refs.livephoto.parentNode.clientWidth - 40,
        height: this.refs.livephoto.parentNode.clientHeight - 15
      }
    });

    const {
      playerMode,
      autoplay,
      lower
    } = this.props;

    if (autoplay && playerMode === PLAYER_MODE.PLAY) {
      this.play(lower);
    }

    this.isApplyingFilters = false
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentIdx } = this.state;
    const {
      storageId,
      appliedData,
      playerMode,
      autoplay,
      lower,
      filters
    } = this.props;
    const enablePlay =
      (autoplay && prevProps.playerMode === PLAYER_MODE.PAUSE && playerMode === PLAYER_MODE.PLAY) ||
      (!prevProps.autoplay && autoplay && playerMode === PLAYER_MODE.PLAY);
    const enablePause =
      (prevProps.playerMode === PLAYER_MODE.PLAY && playerMode === PLAYER_MODE.PAUSE) ||
      (prevProps.autoplay && !autoplay && playerMode === PLAYER_MODE.PLAY);

    if (prevState.currentIdx !== currentIdx) {
      this.renderImageByIndex(appliedData, currentIdx);
    } else if ((!autoplay || playerMode === PLAYER_MODE.PAUSE) && (filters.isDirty || !isEqual(prevProps.filters, filters))) {
      this.applyFilters(storageId, appliedData.length, currentIdx, filters);
    }

    if (enablePlay) {
      this.play(lower);
    } else if (enablePause) {
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
  renderImageByIndex(imgsData, idx) {
    if (inRange(idx, 0, imgsData.length)) {
      this.renderImage(imgsData[idx]);
    }
  }

  // Apply filters to canvas
  // FIXME:
  // When the function is called, if isApplyingFilters euqals to true, filters will not be applied.
  applyFilters(storageId, imgsNum, idx, filters) {
    if (!this.isApplyingFilters && inRange(idx, 0, imgsNum)) {
      this.isApplyingFilters = true;

      applyImageFilters(storageId, idx, filters, 'image').then((result) => {
        this.renderImage(result);
        this.isApplyingFilters = false;
      }).catch(() => {
        // TODO: Error handling
        this.isApplyingFilters = false;
      });
    }
  }

  // Render an image to canvas
  renderImage(imgData) {
    this.refs.canvas.getContext('2d').drawImage(imgData, 0, 0);
  }

  // Get component sytle by calculating resized width and heigth
  getComponentStyle(dimension, parentDimension) {
    const {
      width,
      height
    } = dimension;
    let newWidth = width;
    let newHeight = height;

    if (parentDimension) {
      if (width > height) {
        // Landscape
        newWidth = width > parentDimension.width ? parentDimension.width : width;
        newHeight = parseInt(height * (newWidth / width), 10);
      } else {
        // Portrait
        newHeight = height > parentDimension.height ? parentDimension.height : height;
        newWidth = parseInt(width * (newHeight / height), 10);
      }
    }

    return {
      width: `${newWidth}px`,
      height: `${newHeight}px`
    };
  }

  render() {
    const {
      isLoading,
      parentDimension
    } = this.state;
    const { dimension } = this.props;
    const componentStyle = this.getComponentStyle(dimension, parentDimension);

    return (
      <div
        ref="livephoto"
        className="livephoto-player-component"
        style={componentStyle}
      >
        <canvas
          ref="canvas"
          width={dimension.width}
          height={dimension.height}
        />
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
