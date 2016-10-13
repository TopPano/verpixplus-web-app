'use strict';

import React, { Component, PropTypes } from 'react';
import inRange from 'lodash/inRange';
import isEqual from 'lodash/isEqual';

import { PLAYER_MODE } from 'constants/editor';
import { applyImageFilters } from 'lib/utils';

if (process.env.BROWSER) {
  require('./LivephotoPlayer.css');
}

// Max height for portrait livephoto
const PORTRAIT_MAX_HEIGHT = 600;
// Max width for landscape livephoto
const LANDSCAPE_MAX_WIDTH = 600;
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
// The id of hidden canvas which is used to apply filters
const FILTERS_CANVAS_ID = 'livephoto-player-hidden-canvas';

const propTypes = {
  imagesData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  appliedImagesData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
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
      currentIdx: -1,
      playDirection: PLAY_DIRECTION.INCREASE,
      isLoading: false
    };
  }

  componentDidMount() {
    const {
      playerMode,
      autoplay,
      lower
    } = this.props;

    if (autoplay && playerMode === PLAYER_MODE.PLAY) {
      this.play(lower);
    }

    this.caman = {
      instance: Caman(`#${FILTERS_CANVAS_ID}`),
      isBusy: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentIdx } = this.state;
    const {
      imagesData,
      appliedImagesData,
      playerMode,
      autoplay,
      lower,
      dimension,
      filters
    } = this.props;
    const enablePlay =
      (autoplay && prevProps.playerMode === PLAYER_MODE.PAUSE && playerMode === PLAYER_MODE.PLAY) ||
      (!prevProps.autoplay && autoplay && playerMode === PLAYER_MODE.PLAY);
    const enablePause =
      (prevProps.playerMode === PLAYER_MODE.PLAY && playerMode === PLAYER_MODE.PAUSE) ||
      (prevProps.autoplay && !autoplay && playerMode === PLAYER_MODE.PLAY);

    if (prevState.currentIdx !== currentIdx) {
      this.renderImageByIndex(appliedImagesData, currentIdx, dimension);
    } else if ((!autoplay || playerMode === PLAYER_MODE.PAUSE) && !isEqual(prevProps.filters, filters)) {
      this.applyFilters(imagesData, currentIdx, dimension, filters);
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
  renderImageByIndex(imgsData, idx, dimension) {
    if (inRange(idx, 0, imgsData.length)) {
      this.renderImage(imgsData[idx], dimension);
    }
  }

  // Apply filters to canvas
  // FIXME:
  // When the function is called, if isBusy euqals to true, filters will not be applied.
  applyFilters(imgsData, idx, dimension, filters) {
    if (!this.caman.isBusy && inRange(idx, 0, imgsData.length)) {
      this.caman.isBusy = true;

      applyImageFilters(this.caman.instance, imgsData[idx], dimension, filters).then((appliedImgData) => {
        this.renderImage(appliedImgData, dimension);
        this.caman.isBusy = false;
      }).catch(() => {
        this.caman.isBusy = false;
      });
    }
  }

  // Render an image to canvas
  renderImage(imgData, dimension) {
    this.refs.canvas.getContext('2d').putImageData(imgData, 0, 0, 0, 0, dimension.width, dimension.height);
  }

  // Get component sytle by calculating resized width and heigth
  getComponentStyle(dimension) {
    const {
      width,
      height
    } = dimension;
    let newWidth;
    let newHeight;

    if (width > height) {
      // Landscape
      newWidth = width > LANDSCAPE_MAX_WIDTH ? LANDSCAPE_MAX_WIDTH : width;
      newHeight = parseInt(height * (newWidth / width), 10);
    } else {
      // Portrait
      newHeight = height > PORTRAIT_MAX_HEIGHT ? PORTRAIT_MAX_HEIGHT : height;
      newWidth = parseInt(width * (newHeight / height), 10);
    }

    return {
      width: `${newWidth}px`,
      height: `${newHeight}px`
    };
  }

  render() {
    const { isLoading } = this.state;
    const { dimension } = this.props;
    const componentStyle = this.getComponentStyle(dimension);

    return (
      <div
        className="livephoto-player-component"
        style={componentStyle}
      >
        <canvas
          ref="canvas"
          width={dimension.width}
          height={dimension.height}
        />
        <canvas
          ref="filtersCanvas"
          id={FILTERS_CANVAS_ID}
          width={dimension.width}
          height={dimension.height}
          style={{ display: 'none' }}
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
