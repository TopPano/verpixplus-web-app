'use strict';

import React, { Component, PropTypes } from 'react';
import { Base64 } from 'js-base64';
import queryString from 'query-string';
import urlencode from 'urlencode';

import { isIframe } from '../../../lib/devices';
import { DEFAULT_PANOROMA_OPTIONS } from 'constants/panorama';
import { startViewer, stopViewer } from './viewer';
import Sidebar from './Sidebar';

if (process.env.BROWSER) {
  require('./Viewer.css');
}

export default class Viewer extends Component {
  static propTyes = {
    post: PropTypes.object.isRequired,
    likelist: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    getLikelist: PropTypes.func.isRequired,
    followUser: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      isViewerStarted: false
    }
  }

  componentDidUpdate() {
    if(process.env.BROWSER) {
      const { post } = this.props;
      if(!this.state.isViewerStarted && post.media.srcTiledImages) {
        this.setState({
          isViewerStarted: true
        });
        const search = location.search.substr(1);
        const queryStr = Base64.decode(urlencode.decode(search.substr(0, search.indexOf('&')), 'gbk'));
        const querys = queryString.parse(queryStr);
        const params = {
          imgs: post.media.srcTiledImages,
          cam: {
            lat: querys.lat ? querys.lat : (post.dimension.lat ? post.dimension.lat : DEFAULT_PANOROMA_OPTIONS.LAT),
            lng: querys.lng ? querys.lng : (post.dimension.lng ? post.dimension.lng : DEFAULT_PANOROMA_OPTIONS.LNG),
            fov: querys.fov ? querys.fov : (post.dimension.fov ? post.dimension.fov : DEFAULT_PANOROMA_OPTIONS.FOV)
          },
          canvas: 'container'
        };
        startViewer(params);
      }
    }
  }

  componentWillUnmount() {
    if(process.env.BROWSER) {
      stopViewer();
    }
  }

  render() {
    return (
      <div className="viewer-component">
        <div id='container' />
        { !isIframe() && <Sidebar {...this.props} /> }
      </div>
    );
  }
}

Viewer.displayName = 'Viewer';
