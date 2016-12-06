'use strict';

import React, { Component, PropTypes } from 'react';

import { MODE } from 'constants/editor';
import { MEDIA_TYPE } from 'constants/common';
import InfoPanel from 'containers/common/InfoPanel';
import FilePanel from 'containers/pages/Editor/FilePanel';
import PlayerPanel from 'containers/pages/Editor/PlayerPanel';
import FramePanel from 'containers/pages/Editor/FramePanel';
import Sidebar from 'containers/pages/Editor/Sidebar';
import ProcessModal from './ProcessModal';
import ErrorModal from 'containers/pages/Editor/ErrorModal';

if (process.env.BROWSER) {
  require('./Editor.css');
}

const propTypes = {
  mode: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  isProcessing: PropTypes.bool.isRequired
};

const defaultProps = {
};

class Editor extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);
  }

  render() {
    const { l } = this.context.i18n;
    const {
      mode,
      mediaType,
      isProcessing
    } = this.props;
    const infoPanelProps = {
      light: true,
      links: [{
        to: '',
        text: l('My Gallery')
      }]
    }
    let mainComponents;

    if (mode === MODE.WAIT_FILE) {
      // Wait for user to choose file
      mainComponents = [<FilePanel />]
    } else if (mode === MODE.CREATE) {
      // CREATE mode: after choosing file, creates a new media
      mainComponents =
        mediaType === MEDIA_TYPE.LIVE_PHOTO ?
        [<PlayerPanel />, <FramePanel />] :
        [<PlayerPanel />];
    } else if (mode === MODE.EDIT) {
      // EDIT mode: edit an old media
      mainComponents = [<PlayerPanel />]
    } else  {
      // TODO: any other case ?
    }

    return (
      <div className="editor-component container-full">
        <InfoPanel {...infoPanelProps} />
        <ErrorModal />
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
