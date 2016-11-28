'use strict';

import React, { Component, PropTypes } from 'react';
import isEmpty from 'is-empty';
import FacebookLogin from 'react-facebook-login';
import Select from 'components/Common/Select';

import {
  DEFAULT_TITLE,
  FACEBOOK_PRIVACY
} from 'constants/common';
import FlatButton from 'components/Common/FlatButton';
import clientConfig from 'etc/client';
import externalApiConfig from 'etc/external-api'

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
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      fbUserId: '',
      fbPrivacy: FACEBOOK_PRIVACY.EVERYONE,
      fbAccessToken: '',
      shareTarget: SHARE_TARGET.NONE
    };

    // Bind "this" to member functions
    this.handleClickFacebookLoginBtn = this.handleClickFacebookLoginBtn.bind(this);
    this.handleClickShareToFacebookBtn = this.handleClickShareToFacebookBtn.bind(this);
    this.handleChangeFacebookPrivacyOptions = this.handleChangeFacebookPrivacyOptions.bind(this);
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
    const { l } = this.context.i18n;
    const {
      mediaId,
      title,
      shareFacebookVideo,
      close
    } = this.props;
    const {
      fbUserId,
      fbPrivacy,
      fbAccessToken
    } = this.state;
    const userDesc = this.refs.shareFBVideoDesc.value;
    const isEmptyUserDesc = isEmpty(userDesc);
    const shareUrl = this.genShareUrl(mediaId);
    const signature = `${l('Create your imigination on Verpix')}:\n ${shareUrl}\n#Verpix #MotionGraph`;
    const description = `${userDesc}${isEmptyUserDesc ? '' : '\n\n--\n'}${signature}`;

    shareFacebookVideo({
      mediaId,
      targetId: fbUserId,
      title: title ? title : l(DEFAULT_TITLE),
      description,
      privacy: fbPrivacy,
      fbAccessToken
    });
    close();
  }

  // Handler for changing facebook privacy options
  handleChangeFacebookPrivacyOptions(option) {
    this.setState({
      fbPrivacy: option.value
    })
  }

  render() {
    const { l } = this.context.i18n;
    const fbLoginBtnClass = 'flat-button-component share-btn';
    const {
      fbPrivacy,
      shareTarget
    } = this.state;
    const privacyOptions = [{
      icon: 'globe',
      value: FACEBOOK_PRIVACY.EVERYONE,
      label: l('Public')
    }, {
      icon: 'user',
      value: FACEBOOK_PRIVACY.ALL_FRIENDS,
      label: l('Friends')
    }, {
      icon: 'lock',
      value: FACEBOOK_PRIVACY.SELF,
      label: l('Only Me')
    }];

    return (
      <div className="share-social-component">
        {
          (shareTarget === SHARE_TARGET.NONE) &&
          <div>
            <h5 className="text-center">{l('Share to')}</h5>
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
            <h5 className="text-center">{`${l('Share to')} Facebook`}</h5>
            <textarea
              ref="shareFBVideoDesc"
              className="form-control"
              rows="4"
              placeholder={`${l('Say something')}...`}
            />
            <div className="margin-bottom-15" />
            <div className="facebook-share-settings">
              <Select
                name="facebook-privacy"
                value={fbPrivacy}
                options={privacyOptions}
                clearable={false}
                onChange={this.handleChangeFacebookPrivacyOptions}
              />
              <FlatButton
                text={l('Post')}
                className="share-btn margin-left-10"
                onClick={this.handleClickShareToFacebookBtn}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}

ShareSocial.propTypes = propTypes;
ShareSocial.defaultProps = defaultProps;

export default ShareSocial;
