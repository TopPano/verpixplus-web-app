'use strict'

import React, { Component, PropTypes } from 'react';

import COMMON_CONTENT from 'content/common/en-us.json';
import Modal from 'components/Common/Modal';
import MultiTabsContent from 'components/Common/MultiTabsContent';
import ShareSocial from './ShareSocial';
import ShareEmbed from './ShareEmbed';

if (process.env.BROWSER) {
  require('./ShareModal.css');
}

const CONTENT = COMMON_CONTENT.SHARE_MODAL;

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
  children: PropTypes.node.isRequired,
  createVideo: PropTypes.func.isRequired,
  shareFacebookVideo: PropTypes.func.isRequired,
  notifyShareSuccess: PropTypes.func.isRequired
};

const defaultProps = {
  videoUrl: ''
};

class ShareModal extends Component {
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
    const { isProcessing } = this.props;
    if (isProcessing.createVideo || isProcessing.shareFacebookVideo) {
      this.refs.modal.close();
    }
  }

  render() {
    const {
      mediaId,
      title,
      isVideoCreated,
      videoUrl,
      dimension,
      isProcessing,
      children,
      createVideo,
      shareFacebookVideo,
      notifyShareSuccess
    } = this.props;
    const modalProps = {
      ref: 'modal',
      title: CONTENT.TITLE,
      confirmBtn: {
        show: false
      },
      isProcessing: isProcessing.createVideo || isProcessing.shareFacebookVideo
    };
    const tabsContent = [{
      tab: CONTENT.TABS.SOCIAL,
      content:
        <ShareSocial
          mediaId={mediaId}
          title={title}
          isVideoCreated={isVideoCreated}
          videoUrl={videoUrl}
          dimension={dimension}
          isProcessing={isProcessing}
          createVideo={createVideo}
          shareFacebookVideo={shareFacebookVideo}
          notifyShareSuccess={notifyShareSuccess}
        />
    }, {
      tab: CONTENT.TABS.EMBED,
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
