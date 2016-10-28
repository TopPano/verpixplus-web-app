'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import FacebookLogin from 'react-facebook-login';

import COMMON_CONTENT from 'content/common/en-us.json';
import { renderList } from 'lib/utils';
import IconButton from 'components/Common/IconButton';
import clientConfig from 'etc/client';
import externalApiConfig from 'etc/external-api'

const CONTENT = COMMON_CONTENT.SHARE_MODAL.SOCIAL;

if (process.env.BROWSER) {
  require('./ShareSocial.css');
}

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isVideoCreated: PropTypes.bool.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  createVideo: PropTypes.func.isRequired,
  notifyShareSuccess: PropTypes.func.isRequired
};

const defaultProps = {
};

class ShareSocial extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      isWaitingFbShare: false
    };

    // Bind "this" to member functions
    this.handleClickFacebookBtn = this.handleClickFacebookBtn.bind(this);
    this.handleClickTwitterBtn = this.handleClickTwitterBtn.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { isVideoCreated } = this.props;

    if (this.state.isWaitingFbShare && (prevProps.isVideoCreated !== isVideoCreated)) {
      // A new video is created
      this.setState({
        isWaitingFbShare: false
      });
      this.shareFacebook();
    }
  }

  // Genrate the sharing url by media ID
  genShareUrl(mediaId) {
    return `${clientConfig.staticUrl}/embed/@${mediaId}`;
  }

  // Share to facebook by calling open graph share dialog
  shareFacebook() {
    if(window.FB) {
      const {
        mediaId,
        notifyShareSuccess
      } = this.props;
      const shareUrl = this.genShareUrl(mediaId);

      window.FB.ui({
        method: 'share',
        display: 'iframe',
        mobile_iframe: true,
        href: shareUrl
      }, (res) => {
        if (res && !res.error_code) {
          notifyShareSuccess();
        } else {
          // TODO: Error handling
        }
      });
    }
  }

  // Share to Twitter
  shareTwitter() {
    const {
      title,
      mediaId
    } = this.props;
    const shareUrl = this.genShareUrl(mediaId);
    const positionLeft = (screen.width / 2) - 400;
    const positionTop = (screen.height / 2) - 200;
    const spec =`height=400,width=800,top=${positionTop},left=${positionLeft}`;
    const url = `https://twitter.com/share?text=${title}&url=${encodeURIComponent(shareUrl)}`;

    window.open(url, 'name', spec);
  }

  // Handler for clicking facebook sharing button
  handleClickFacebookBtn() {
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
        // Share to facebook
        this.shareFacebook();
      }
    }
  }

  // Handler for clicking Twitter sharing button
  handleClickTwitterBtn() {
    this.shareTwitter();
  }

  // Render list of social buutons
  renderBtnsList(propsList) {
    return renderList(propsList, (props, idx) => {
      return (
        <IconButton
          key={idx}
          {...props}
        />
      );
    });
  }

  render() {
    const { isProcessing } = this.props;
    const btnClass = classNames({
      'share-social-btn btn-u btn-brd rounded btn-u-sea': true,
      'disabled': isProcessing
    });
    const btnsListProps = [{
      icon: 'twitter',
      text: 'Twitter',
      className: btnClass,
      handleClick: this.handleClickTwitterBtn
    }];
    const btnsList = this.renderBtnsList(btnsListProps);

    return (
      <div className="share-social-component">
        <h5 className="text-center">{CONTENT.SHARE_TO}</h5>
        <div className="container-center-col">
          <FacebookLogin
            appId={externalApiConfig.facebook.id}
            version={externalApiConfig.facebook.version}
            callback={this.handleClickFacebookBtn}
            cssClass={btnClass}
            icon="fa-facebook"
            textButton="Facebook"
          />
          {btnsList}
        </div>
      </div>
    );
  }
}

ShareSocial.propTypes = propTypes;
ShareSocial.defaultProps = defaultProps;

export default ShareSocial;
