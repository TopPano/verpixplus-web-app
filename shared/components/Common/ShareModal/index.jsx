'use strict'

import React, { Component, PropTypes } from 'react';

import clientConfig from 'etc/client';
import Modal from 'components/Common/Modal';
import MultiTabsContent from 'components/Common/MultiTabsContent';
import ShareSocial from './ShareSocial';
import ShareLink from './ShareLink';
import ShareEmbed from './ShareEmbed';

if (process.env.BROWSER) {
  require('./ShareModal.css');
}

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  panoSharedPhoto: PropTypes.string,
  altPhotoUrl: PropTypes.string,
  children: PropTypes.node.isRequired,
  shareFacebookVideo: PropTypes.func.isRequired,
  shareFacebookPanophto: PropTypes.func.isRequired,
  notifyShareSuccess: PropTypes.func.isRequired
};

const defaultProps = {
  panoSharedPhoto: ''
};

class ShareModal extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  // Open the modal
  open() {
    this.refs.modal.open();
  }

  // Close the modal
  close() {
    this.refs.modal.close();
  }

  // Genrate the sharing url by media ID
  genShareUrl(mediaId) {
    return `${clientConfig.staticUrl}/embed/@${mediaId}`;
  }

  render() {
    const { l } = this.context.i18n;
    const {
      mediaId,
      mediaType,
      title,
      panoSharedPhoto,
      altPhotoUrl,
      children,
      shareFacebookVideo,
      shareFacebookPanophoto,
      notifyShareSuccess
    } = this.props;
    const modalProps = {
      ref: 'modal',
      title: l('Share Your Media'),
      confirmBtn: {
        show: false
      }
    };
    const shareUrl = this.genShareUrl(mediaId);
    const tabsContent = [{
      tab: l('Social Media'),
      content:
        <ShareSocial
          mediaId={mediaId}
          mediaType={mediaType}
          title={title}
          panoSharedPhoto={panoSharedPhoto}
          shareUrl={shareUrl}
          shareFacebookVideo={shareFacebookVideo}
          shareFacebookPanophoto={shareFacebookPanophoto}
          notifyShareSuccess={notifyShareSuccess}
          close={this.close}
        />
    }, {
      tab: l('Link'),
      content: <ShareLink shareUrl={shareUrl} />
    }, {
      tab: l('Embed'),
      content:
        <ShareEmbed
          mediaId={mediaId}
          mediaType={mediaType}
          shareUrl={shareUrl}
          altPhotoUrl={altPhotoUrl}
        />
    }];

    return (
      <div
        className="share-modal-component"
        onClick={this.open}
      >
        {children}
        <Modal {...modalProps} >
          <MultiTabsContent tabsContent={tabsContent} />
        </Modal>
      </div>
    );
  }
}

ShareModal.propTypes = propTypes;
ShareModal.defaultProps = defaultProps;

export default ShareModal;
