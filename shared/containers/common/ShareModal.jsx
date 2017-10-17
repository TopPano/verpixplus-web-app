'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  shareFacebookVideo,
  shareFacebookPanophoto
} from 'actions/media';
import { pushNotification } from 'actions/notifications';
import { NOTIFICATIONS } from 'constants/notifications';

import ShareModal from 'components/Common/ShareModal';

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
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
    this.shareFacebookVideo = this.shareFacebookVideo.bind(this);
    this.shareFacebookPanophoto = this.shareFacebookPanophoto.bind(this);
    this.notifyShareSuccess = this.notifyShareSuccess.bind(this);
  }

  // Wrapper for dispatching shareFacebookVideo,
  // which shares a video to Facebook
  shareFacebookVideo(params) {
    this.props.dispatch(shareFacebookVideo(params));
  }

  // Wrapper for dispatching shareFacebookPanophoto,
  // which shares a panophoto to Facebook
  shareFacebookPanophoto(params) {
    this.props.dispatch(shareFacebookPanophoto(params));
  }

  // Wrapper for dispatching pushNotifications,
  // which push a notification for sharing successfully.
  notifyShareSuccess() {
    this.props.dispatch(pushNotification(NOTIFICATIONS.SHARE_SUCCESS));
  }

  render() {
    return (
      <ShareModal
        {...this.props}
        shareFacebookVideo={this.shareFacebookVideo}
        shareFacebookPanophoto={this.shareFacebookPanophoto}
        notifyShareSuccess={this.notifyShareSuccess}
      >
        {this.props.children}
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
