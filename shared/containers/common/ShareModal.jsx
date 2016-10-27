'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createVideo } from 'actions/media';
import { pushNotification } from 'actions/notifications';
import { NOTIFICATIONS } from 'constants/notifications';

import ShareModal from 'components/Common/ShareModal';

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  isVideoCreated: PropTypes.bool.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

const defaultProps = {
};

class ShareModalContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.createVideo = this.createVideo.bind(this);
    this.notifyShareSuccess = this.notifyShareSuccess.bind(this);
  }

  // Wrapper for dispatching createVideo,
  // which creates a video for livephoto
  createVideo({ mediaId }) {
    this.props.dispatch(createVideo({ mediaId }));
  }

  // Wrapper for dispatching pushNotifications,
  // which push a notification for sharing successfully.
  notifyShareSuccess() {
    this.props.dispatch(pushNotification(NOTIFICATIONS.SHARE_SUCCESS));
  }

  render() {
    const {
      mediaId,
      isVideoCreated,
      isProcessing,
      children
    } = this.props;

    return (
      <ShareModal
        ref="modal"
        mediaId={mediaId}
        isVideoCreated={isVideoCreated}
        isProcessing={isProcessing}
        createVideo={this.createVideo}
        notifyShareSuccess={this.notifyShareSuccess}
      >
        {children}
      </ShareModal>
    );
  }
}

ShareModalContainer.propTypes = propTypes;
ShareModalContainer.defaultProps = defaultProps;

function mapStateToProps(state, ownProps) {
  return ownProps;
}

export default connect(mapStateToProps)(ShareModalContainer);
