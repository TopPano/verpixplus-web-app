'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import isEmpty from 'is-empty';
import FacebookLogin from 'react-facebook-login';

import COMMON_CONTENT from 'content/common/en-us.json';
import FlatButton from 'components/Common/FlatButton';
import clientConfig from 'etc/client';
import externalApiConfig from 'etc/external-api'

const CONTENT = COMMON_CONTENT.SHARE_MODAL.SOCIAL;

if (process.env.BROWSER) {
  require('./ShareSocial.css');
}

const PREVIEW_VIDEO_MAX = {
  WIDTH: 500,
  HEIGHT: 500
};

const SHARE_TARGET = {
  NONE: 'NONE',
  FACEBOOK: 'FACEBOOK',
  TWITTER: 'TWITTER'
};

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isVideoCreated: PropTypes.bool.isRequired,
  videoUrl: PropTypes.string,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  isProcessing: PropTypes.object.isRequired,
  createVideo: PropTypes.func.isRequired,
  shareFacebookVideo: PropTypes.func.isRequired,
  notifyShareSuccess: PropTypes.func.isRequired
};

const defaultProps = {
  videoUrl: ''
};

class ShareSocial extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      fbUserId: '',
      fbAccessToken: '',
      isWaitingFbShare: false,
      shareTarget: SHARE_TARGET.NONE
    };

    // Bind "this" to member functions
    this.handleClickFacebookBtn = this.handleClickFacebookBtn.bind(this);
    this.handleClickShareToFacebookBtn = this.handleClickShareToFacebookBtn.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { isVideoCreated } = this.props;

    if (this.state.isWaitingFbShare && (prevProps.isVideoCreated !== isVideoCreated)) {
      // A new video is created
      this.setState({
        isWaitingFbShare: false,
        shareTarget: SHARE_TARGET.FACEBOOK
      });
    }
  }

  // Genrate the sharing url by media ID
  genShareUrl(mediaId) {
    return `${clientConfig.staticUrl}/embed/@${mediaId}`;
  }

  // Handler for clicking facebook sharing button
  handleClickFacebookBtn(res) {
    const {
      id,
      accessToken
    } = res;

    if (id && accessToken) {
      this.setState({
        fbUserId: id,
        fbAccessToken: accessToken
      });

      const { isWaitingFbShare } = this.state;
      const {
        mediaId,
        isVideoCreated,
        createVideo
      } = this.props;

      if (!isWaitingFbShare) {
        if (!isVideoCreated) {
          // Video URL is empty, create a video and wait
          createVideo({ mediaId });
          this.setState({
            isWaitingFbShare: true
          });
        } else {
          // Show Preview for sharing to Facebook
          this.setState({
            shareTarget: SHARE_TARGET.FACEBOOK
          });
        }
      }
    }
  }

  // Handler for clicking button to share video to Facebook
  handleClickShareToFacebookBtn() {
    const {
      mediaId,
      videoUrl,
      shareFacebookVideo
    } = this.props;
    const {
      fbUserId,
      fbAccessToken
    } = this.state;
    const userDesc = this.refs.shareFBVideoDesc.value;
    const isEmptyUserDesc = isEmpty(userDesc);
    const shareUrl = this.genShareUrl(mediaId);
    const signature = `${CONTENT.SIGNATURE}: ${shareUrl}\n#verpix #MotionGraph`;
    const description = `${userDesc}${isEmptyUserDesc ? '' : '\n\n--\n'}${signature}`;

    shareFacebookVideo({
      targetId: fbUserId,
      videoUrl,
      description,
      accessToken: fbAccessToken
    });
  }

  // Calculate the style of the video for preview
  calculatePreviewVideoStyle(dimension) {
    const {
      width,
      height
    } = dimension
    let newWidth = width;
    let newHeight = height;

    if (width < height) {
      // Protrait
      if (height > PREVIEW_VIDEO_MAX.HEIGHT) {
        newWidth = parseInt(width * (PREVIEW_VIDEO_MAX.HEIGHT / height), 10);
        newHeight = PREVIEW_VIDEO_MAX.HEIGHT;
      }
    } else {
      // Landscape
      if (width > PREVIEW_VIDEO_MAX.WIDTH) {
        newWidth = PREVIEW_VIDEO_MAX.WIDTH;
        newHeight = parseInt(height * (PREVIEW_VIDEO_MAX.WIDTH / width), 10);
      }
    }

    return {
      width: `${newWidth}px`,
      height: `${newHeight}px`
    };
  }

  render() {
    const {
      videoUrl,
      dimension,
      isProcessing
    } = this.props;
    const disabled = isProcessing.createVideo || isProcessing.shareFacebookVideo
    const fbLoginBtnClass = classNames({
      'flat-button-component share-btn': true,
      'disabled': disabled
    });
    const { shareTarget } = this.state;
    const previewVideoStyle = this.calculatePreviewVideoStyle(dimension);

    return (
      <div className="share-social-component">
        {
          ((shareTarget === SHARE_TARGET.NONE) || (shareTarget === SHARE_TARGET.TWITTER)) &&
          <div>
            <h5 className="text-center">{CONTENT.SHARE_TO}</h5>
            <div className="container-center-col">
              <FacebookLogin
                appId={externalApiConfig.facebook.id}
                version={externalApiConfig.facebook.version}
                scope="publish_actions"
                callback={this.handleClickFacebookBtn}
                cssClass={fbLoginBtnClass}
                textButton="Facebook"
              />
            </div>
          </div>
        }
        {
          (shareTarget === SHARE_TARGET.FACEBOOK) &&
          <div className="facebook-share-preview container-center-row">
            <h5 className="text-center">{`${CONTENT.SHARE_TO} Facebook`}</h5>
            <textarea
              ref="shareFBVideoDesc"
              className="form-control"
              rows="4"
              disabled={disabled}
              placeholder={CONTENT.PLACE_HOLDER}
            />
            <div className="margin-bottom-15" />
            <video
              style={previewVideoStyle}
              src={videoUrl}
              width={dimension.width}
              height={dimension.height}
              autoPlay
              loop
            />
            <div className="margin-bottom-15" />
            <FlatButton
              text={CONTENT.SHARE_BTN}
              className="share-btn"
              disabled={disabled}
              onClick={this.handleClickShareToFacebookBtn}
            />
          </div>
        }
      </div>
    );
  }
}

ShareSocial.propTypes = propTypes;
ShareSocial.defaultProps = defaultProps;

export default ShareSocial;
