'use strict';

import React, { Component, PropTypes } from 'react';
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

const SHARE_TARGET = {
  NONE: 'NONE',
  FACEBOOK: 'FACEBOOK'
};

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isVideoCreated: PropTypes.bool.isRequired,
  shareFacebookVideo: PropTypes.func.isRequired,
  notifyShareSuccess: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

const defaultProps = {
};

class ShareSocial extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      fbUserId: '',
      fbAccessToken: '',
      shareTarget: SHARE_TARGET.NONE
    };

    // Bind "this" to member functions
    this.handleClickFacebookLoginBtn = this.handleClickFacebookLoginBtn.bind(this);
    this.handleClickShareToFacebookBtn = this.handleClickShareToFacebookBtn.bind(this);
  }

  // Genrate the sharing url by media ID
  genShareUrl(mediaId) {
    return `${clientConfig.staticUrl}/embed/@${mediaId}`;
  }

  // Handler for clicking facebook sharing button
  handleClickFacebookLoginBtn(res) {
    const {
      id,
      accessToken
    } = res;

    if (id && accessToken) {
      this.setState({
        fbUserId: id,
        fbAccessToken: accessToken,
        shareTarget: SHARE_TARGET.FACEBOOK
      });
    }
  }

  // Handler for clicking button to share video to Facebook
  handleClickShareToFacebookBtn() {
    const {
      mediaId,
      shareFacebookVideo,
      close
    } = this.props;
    const {
      fbUserId,
      fbAccessToken
    } = this.state;
    const userDesc = this.refs.shareFBVideoDesc.value;
    const isEmptyUserDesc = isEmpty(userDesc);
    const shareUrl = this.genShareUrl(mediaId);
    const signature = `${CONTENT.SIGNATURE}:\n ${shareUrl}\n#Verpix #MotionGraph`;
    const description = `${userDesc}${isEmptyUserDesc ? '' : '\n\n--\n'}${signature}`;

    shareFacebookVideo({
      mediaId,
      targetId: fbUserId,
      description,
      fbAccessToken
    });
    close();
  }

  render() {
    const fbLoginBtnClass = 'flat-button-component share-btn';
    const { shareTarget } = this.state;

    return (
      <div className="share-social-component">
        {
          (shareTarget === SHARE_TARGET.NONE) &&
          <div>
            <h5 className="text-center">{CONTENT.SHARE_TO}</h5>
            <div className="container-center-col">
              <FacebookLogin
                appId={externalApiConfig.facebook.id}
                version={externalApiConfig.facebook.version}
                scope="publish_actions"
                callback={this.handleClickFacebookLoginBtn}
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
              placeholder={CONTENT.PLACE_HOLDER}
            />
            <div className="margin-bottom-15" />
            <div className="margin-bottom-15" />
            <FlatButton
              text={CONTENT.SHARE_BTN}
              className="share-btn"
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
