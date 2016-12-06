'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { setPanophotoFunctions } from 'actions/editor';
import PlayerPanel from 'components/Pages/Editor/PlayerPanel'

const propTypes = {
  editor: PropTypes.object.isRequired
};

const defaultProps = {
};

class PlayerPanelContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.setPanophotoFunctions = this.setPanophotoFunctions.bind(this);
  }

  // Wrapper function for dispatching setPanophotoFunctions,
  // which set up the functions of panophoto,
  // such as get current snapshot of panophoto
  setPanophotoFunctions(params) {
    this.props.dispatch(setPanophotoFunctions(params));
  }

  render() {
    const { editor } = this.props;

    return (
      <PlayerPanel
        {...editor}
        setPanophotoFunctions={this.setPanophotoFunctions}
      />
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
