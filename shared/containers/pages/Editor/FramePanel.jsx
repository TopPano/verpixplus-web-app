'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  playerPlay,
  playerPause,
  trim
} from 'actions/editor';

import FramePanel from 'components/Pages/Editor/FramePanel'

const propTypes = {
  editor: PropTypes.object.isRequired
};

const defaultProps = {
};

class FramePanelContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member function
    this.playerPlay = this.playerPlay.bind(this);
    this.playerPause = this.playerPause.bind(this);
    this.trim = this.trim.bind(this);
  }

  // Wrapper for dispatching playerPlay function,
  // which enable the palyer starts playing
  playerPlay() {
    this.props.dispatch(playerPlay());
  }

  // Wrapper for dispatching playerPause function,
  // which enable the palyer pause playing
  playerPause() {
    this.props.dispatch(playerPause());
  }

  // Wrapper for dispatching trim function,
  // which trims the range of frames
  trim({ lower, upper }) {
    this.props.dispatch(trim({
      lower,
      upper
    }));
  }

  render() {
    const { editor } = this.props;

    return (
      <FramePanel
        {...editor}
        playerPlay={this.playerPlay}
        playerPause={this.playerPause}
        trim={this.trim}
      />
    );
  }
}

FramePanelContainer.propTypes = propTypes;
FramePanelContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { editor } = state;
  return {
    editor
  };
}

export default connect(mapStateToProps)(FramePanelContainer);
