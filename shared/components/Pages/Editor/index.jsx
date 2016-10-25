'use strict';

import React, { Component, PropTypes } from 'react';

import { MODE } from 'constants/editor';
import FilePanel from 'containers/pages/Editor/FilePanel';
import PlayerPanel from 'containers/pages/Editor/PlayerPanel';
import FramePanel from 'containers/pages/Editor/FramePanel';
import Sidebar from 'containers/pages/Editor/Sidebar';
import ProcessModal from './ProcessModal';

if (process.env.BROWSER) {
  require('./Editor.css');
}

const propTypes = {
  mode: PropTypes.string.isRequired,
  isProcessing: PropTypes.bool.isRequired
};

const defaultProps = {
};

class Editor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      mode,
      isProcessing
    } = this.props;
    let mainComponent;

    if (mode === MODE.WAIT_FILE) {
      // Wait for user to choose file
      mainComponent =
        <FilePanel />;
    } else if (mode === MODE.CREATE) {
      // CREATE mode: after choosing file, creates a new media
      mainComponent =
        <div className="main-wrapper fill">
          <PlayerPanel />
          <FramePanel />
        </div>
    } else if (mode === MODE.EDIT) {
      // EDIT mode: edit an old media
      mainComponent =
        <div className="main-wrapper fill">
          <PlayerPanel />
        </div>
    } else  {
      // TODO: any other case ?
    }

    return (
      <div className="editor-component container-full">
        <div className="editor-main">
          {mainComponent}
        </div>
        <div className="editor-sidebar">
          <Sidebar />
        </div>
        {
          (mode !== MODE.WAIT_FILE) &&
          <ProcessModal isProcessing={isProcessing} />
        }
      </div>
    );
  }
}

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor;
