'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PlayerPanel from 'components/Pages/Editor/PlayerPanel'

const propTypes = {
  editor: PropTypes.object.isRequired
};

const defaultProps = {
};

class PlayerPanelContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { editor } = this.props;

    return (
      <PlayerPanel {...editor} />
    );
  }
}

PlayerPanelContainer.propTypes = propTypes;
PlayerPanelContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { editor } = state;
  return {
    editor
  };
}

export default connect(mapStateToProps)(PlayerPanelContainer);
