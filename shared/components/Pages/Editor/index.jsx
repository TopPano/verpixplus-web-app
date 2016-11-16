'use strict';

import React, { Component, PropTypes } from 'react';

import { MODE } from 'constants/editor';
import InfoPanel from 'containers/common/InfoPanel';
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
    const infoPanelProps = {
      light: true,
      links: [{
        to: '',
        text: 'My Gallery'
      }]
    }
    let mainComponents;

    if (mode === MODE.WAIT_FILE) {
      // Wait for user to choose file
      mainComponents = [<FilePanel />]
    } else if (mode === MODE.CREATE) {
      // CREATE mode: after choosing file, creates a new media
      mainComponents = [<PlayerPanel />, <FramePanel />]
    } else if (mode === MODE.EDIT) {
      // EDIT mode: edit an old media
      mainComponents = [<PlayerPanel />]
    } else  {
      // TODO: any other case ?
    }

    return (
      <div className="editor-component container-full">
        <InfoPanel {...infoPanelProps} />
        <div className="editor-main">
          <div className="main-header container-center-row">
            <img
              src="/static/images/editor/logo.svg"
              alt="logo"
              width="145"
              height="33"
            />
          </div>
          <div className="main-content">
            {mainComponents}
          </div>
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
