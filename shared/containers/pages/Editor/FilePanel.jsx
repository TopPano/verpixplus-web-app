'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  convert
} from 'actions/editor';

import FilePanel from 'components/Pages/Editor/FilePanel'

const propTypes = {
  editor: PropTypes.object.isRequired
};

const defaultProps = {
};

class FilePanelContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member function
    this.convert = this.convert.bind(this);
  }

  // Wrapper for dispatching convert function,
  // which convert a video to a series of frames (livephoto)
  // or convet an image to panophoto
  convert(params) {
    this.props.dispatch(convert(params));
  }

  render() {
    const { editor } = this.props;

    return (
      <FilePanel
        {...editor}
        convert={this.convert}
      />
    );
  }
}

FilePanelContainer.propTypes = propTypes;
FilePanelContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { editor } = state;
  return {
    editor
  };
}

export default connect(mapStateToProps)(FilePanelContainer);
