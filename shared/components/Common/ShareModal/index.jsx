'use strict'

import React, { Component, PropTypes } from 'react';

import Modal from 'components/Common/Modal';
import MultiTabsContent from 'components/Common/MultiTabsContent';
import ShareSocial from './ShareSocial';
import ShareEmbed from './ShareEmbed';

if (process.env.BROWSER) {
  require('./ShareModal.css');
}

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isVideoCreated: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  shareFacebookVideo: PropTypes.func.isRequired,
  notifyShareSuccess: PropTypes.func.isRequired
};

const defaultProps = {
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

  render() {
    const { l } = this.context.i18n;
    const {
      mediaId,
      title,
      isVideoCreated,
      children,
      shareFacebookVideo,
      notifyShareSuccess
    } = this.props;
    const modalProps = {
      ref: 'modal',
      title: l('Share Your Media'),
      confirmBtn: {
        show: false
      }
    };
    const tabsContent = [{
      tab: l('Social Media'),
      content:
        <ShareSocial
          mediaId={mediaId}
          title={title}
          isVideoCreated={isVideoCreated}
          shareFacebookVideo={shareFacebookVideo}
          notifyShareSuccess={notifyShareSuccess}
          close={this.close}
        />
    }, {
      tab: l('Embed'),
      content: <ShareEmbed mediaId={mediaId} />
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
