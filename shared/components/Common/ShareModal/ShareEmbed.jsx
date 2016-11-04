'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import isInteger from 'lodash/isInteger';
import toNumber from 'lodash/toNumber';
import fileSaver from 'file-saver';
import JSZip from 'jszip';

import COMMON_CONTENT from 'content/common/en-us.json';
import { EMBED } from 'constants/common';
import Livephoto from 'components/Common/Livephoto';
import IconButton from 'components/Common/IconButton';
import ShareEmbedCoder from './ShareEmbedCoder';
import genAdHTML from './genAdHTML';

const CONTENT = COMMON_CONTENT.SHARE_MODAL.EMBED;

if (process.env.BROWSER) {
  require('./ShareEmbed.css');
}

const propTypes = {
  mediaId: PropTypes.string.isRequired
};

const defaultProps = {
};

class ShareEmbed extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleClickPreviewBtn = this.handleClickPreviewBtn.bind(this);
    this.handleClickDownloadBtn = this.handleClickDownloadBtn.bind(this);

    // Initialize state
    this.state = {
      showPreview: false,
      embedWidth: EMBED.DEFAULT_WIDTH,
      embedHeight: EMBED.DEFAULT_HEIGHT
    };
  }

  // Handler for embed size change
  handleSizeChange() {
    const { embedWidth, embedHeight } = this.state;
    const newEmbedWidth = toNumber(this.refs.inputWidth.value);
    const newEmbedHeight = toNumber(this.refs.inputHeight.value);
    this.setState({
      embedWidth: isInteger(newEmbedWidth) ? newEmbedWidth : embedWidth,
      embedHeight: isInteger(newEmbedHeight) ? newEmbedHeight : embedHeight
    });
  }

  // Handler for clicking preview button
  handleClickPreviewBtn() {
    this.setState({
      showPreview: !this.state.showPreview
    });
  }

  // Handler for clicking download button
  handleClickDownloadBtn() {
    const { mediaId } = this.props;
    const {
      embedWidth,
      embedHeight
    } = this.state;
    const zip = new JSZip();

    zip.file('index.html', genAdHTML(mediaId, embedWidth, embedHeight, EMBED.SDK_LIVEPHOTO));
    zip.generateAsync({
      type: 'blob'
    }).then((zipBlob) => {
      fileSaver.saveAs(zipBlob, `ad-${mediaId}.zip`);
    })
  }

  // Generate the usage code
  genUsageCode(id, type, width, height) {
    const dataWidth = width > 0 ? `data-width="${width}"` : '';
    const dataHeight = height > 0 ? `data-height="${height}"` : '';

    return `<div class="verpix-${type}" data-id="${id}" ${dataWidth} ${dataHeight}></div>`;
  }

  render() {
    const {
      showPreview,
      embedWidth,
      embedHeight
    } = this.state;
    const { mediaId } = this.props;
    const usageCode = this.genUsageCode(mediaId,'livephoto', embedWidth, embedHeight);
    const playerClass = classNames({
      'preview-player': true,
      'active': showPreview
    });
    const codersStyle = {
      display: !showPreview ? 'block' : 'none'
    };

    return (
      <div className="share-embed-component">
        <div className="container-center-row">
          <div className={playerClass}>
            <Livephoto
              mediaId={mediaId}
              width={embedWidth}
              height={embedHeight}
            />
          </div>
        </div>
        <div style={codersStyle}>
          <ShareEmbedCoder
            title={CONTENT.INSTALL}
            text={EMBED.SDK_LIVEPHOTO}
          />
          <hr />
          <ShareEmbedCoder
            title={CONTENT.USAGE}
            text={usageCode}
          />
        </div>
          <div className="margin-bottom-10" />
          <div className="inputs-wrapper container-center-col">
            <input
              ref="inputWidth"
              type="text"
              className="form-control"
              value={embedWidth}
              onChange={this.handleSizeChange}
            />
            <i className="fa fa-times margin-left-5 margin-right-5" />
            <input
              ref="inputHeight"
              type="text"
              className="form-control"
              value={embedHeight}
              onChange={this.handleSizeChange}
            />
          </div>
        <div className="preview-btn-wrapper text-center">
          <IconButton
            className="share-embed-btn btn-u btn-brd btn-brd-hover rounded btn-u-sea"
            icon={`fa fa-${showPreview ? 'code' : 'eye'}`}
            text={showPreview ? CONTENT.CODE : CONTENT.PREVIEW}
            handleClick={this.handleClickPreviewBtn}
          />
          <IconButton
            className="share-embed-btn btn-u btn-brd btn-brd-hover rounded btn-u-sea"
            icon="download"
            text="Download"
            handleClick={this.handleClickDownloadBtn}
          />
        </div>
      </div>
    );
  }
}

ShareEmbed.propTypes = propTypes;
ShareEmbed.defaultProps = defaultProps;

export default ShareEmbed;
