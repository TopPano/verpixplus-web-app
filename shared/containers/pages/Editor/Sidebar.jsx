'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  playerPlay,
  playerPause,
  changeEditTarget,
  edit
} from 'actions/editor';

import Sidebar from 'components/Pages/Editor/Sidebar'

const propTypes = {
  editor: PropTypes.object.isRequired
};

const defaultProps = {
};

class SidebarContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member function
    this.playerPlay = this.playerPlay.bind(this);
    this.playerPause = this.playerPause.bind(this);
    this.changeEditTarget = this.changeEditTarget.bind(this);
    this.edit = this.edit.bind(this);
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

  // Wrapper for dispatching changeEditTarget function,
  // which changes the target (for example: frames, filters) for editting.
  changeEditTarget(editTarget) {
    this.props.dispatch(changeEditTarget(editTarget));
  }

  // Wrapper for dispatching edit function,
  // which update the content related to this media
  edit({ title, caption }) {
    this.props.dispatch(edit({
      title,
      caption
    }));
  }

  render() {
    const { editor } = this.props;

    return (
      <Sidebar
        playerPlay={this.playerPlay}
        playerPause={this.playerPause}
        changeEditTarget={this.changeEditTarget}
        edit={this.edit}
        {...editor}
      />
    );
  }
}

SidebarContainer.propTypes = propTypes;
SidebarContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { editor } = state;
  return {
    editor
  };
}

export default connect(mapStateToProps)(SidebarContainer);
