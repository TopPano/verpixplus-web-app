'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { clearEditorErr } from 'actions/editor';
import ErrorModal from 'components/Common/ErrorModal';

const propTypes = {
  err: PropTypes.shape({
    message: PropTypes.string.isRequired
  }).isRequired
};

const defaultProps = {
};

class ErrorModalContainer extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.clearErr = this.clearErr.bind(this);
  }

  // Wrapper function for dispatching clearEditorErr,
  // which clears the error of editor state
  clearErr() {
    this.props.dispatch(clearEditorErr());
  }

  render() {
    const { err } = this.props;

    return (
      <ErrorModal
        err={err}
        clearErr={this.clearErr}
      />
    );
  }
}

ErrorModalContainer.propTypes = propTypes;
ErrorModalContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { err} = state.editor;
  return {
    err
  };
}

export default connect(mapStateToProps)(ErrorModalContainer);
