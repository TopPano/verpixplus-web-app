'use strict'

import React, { Component, PropTypes } from 'react';

import COMMON_CONTENT from 'content/common/en-us.json';
import Modal from 'components/Common/Modal';
import MultiTabsContent from 'components/Common/MultiTabsContent';
import ShareSocial from './ShareSocial';
import ShareEmbed from './ShareEmbed';

if (process.env.BROWSER) {
  require('./Share.css');
}

const CONTENT = COMMON_CONTENT.SHARE;

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  isProcessing: PropTypes.bool
};

const defaultProps = {
  isProcessing: false
};

class Share extends Component {
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
    if (!this.props.isProcessing) {
      this.refs.modal.close();
    }
  }

  render() {
    const {
      mediaId,
      isProcessing
    } = this.props;
    const modalProps = {
      ref: 'modal',
      title: CONTENT.TITLE,
      confirmBtn: {
        show: false
      },
      isProcessing
    };
    const tabsContent = [{
      tab: CONTENT.TABS.SOCIAL,
      content: <ShareSocial />
    }, {
      tab: CONTENT.TABS.EMBED,
      content: <ShareEmbed mediaId={mediaId} />
    }];

    return (
      <Modal {...modalProps} >
        <MultiTabsContent tabsContent={tabsContent} />
      </Modal>
    );
  }
}

Share.propTypes = propTypes;
Share.defaultProps = defaultProps;

export default Share;
