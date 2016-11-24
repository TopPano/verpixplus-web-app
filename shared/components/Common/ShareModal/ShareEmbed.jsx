'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import isInteger from 'lodash/isInteger';
import toNumber from 'lodash/toNumber';
import fileSaver from 'file-saver';
import JSZip from 'jszip';

import { EMBED } from 'constants/common';
import Livephoto from 'components/Common/Livephoto';
import FlatButton from 'components/Common/FlatButton';
import ShareEmbedCoder from './ShareEmbedCoder';
import genAdHTML from './genAdHTML';

if (process.env.BROWSER) {
  require('./ShareEmbed.css');
}

const propTypes = {
  mediaId: PropTypes.string.isRequired
};

const defaultProps = {
};

class ShareEmbed extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleClickTagChange = this.handleClickTagChange.bind(this);
    this.handleClickPreviewBtn = this.handleClickPreviewBtn.bind(this);
    this.handleClickDownloadBtn = this.handleClickDownloadBtn.bind(this);

    // Initialize state
    this.state = {
      showPreview: false,
      embedWidth: EMBED.DEFAULT_WIDTH,
      embedHeight: EMBED.DEFAULT_HEIGHT,
      clickTag: ''
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

  // Handler for the input of clickTag changes
  handleClickTagChange() {
    this.setState({
      clickTag: this.refs.inputClickTag.value
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
      embedHeight,
      clickTag
    } = this.state;
    const zip = new JSZip();

    zip.file('index.html', genAdHTML(mediaId, clickTag, embedWidth, embedHeight, EMBED.SDK_LIVEPHOTO));
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
    const { l } = this.context.i18n;
    const {
      showPreview,
      embedWidth,
      embedHeight,
      clickTag
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
            title={l('SDK Installation')}
            text={EMBED.SDK_LIVEPHOTO}
          />
          <hr />
          <ShareEmbedCoder
            title={l('Usage')}
            text={usageCode}
          />
        </div>
          <div className="margin-bottom-10" />
          <div className="inputs-wrapper container-center-col">
            <p>{`${l('Size')}:`}</p>
            <input
              ref="inputWidth"
              type="text"
              className="form-control "
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
          <div className="margin-bottom-10" />
          <div className="inputs-wrapper container-center-col">
            <p>{`${l('Click Tag')}:`}</p>
            <input
              ref="inputClickTag"
              type="text"
              className="click-tag form-control"
              placeholder={l('Google AdWorlds Click Tag')}
              value={clickTag}
              onChange={this.handleClickTagChange}
            />
          </div>
          <div className="margin-bottom-10" />
        <div className="preview-btn-wrapper text-center">
          <FlatButton
            className="share-btn"
            text={showPreview ? l('Code') : l('Preview')}
            onClick={this.handleClickPreviewBtn}
          />
          <FlatButton
            className="share-btn"
            text={l('Download')}
            disabled={clickTag === ''}
            onClick={this.handleClickDownloadBtn}
          />
        </div>
      </div>
    );
  }
}

ShareEmbed.propTypes = propTypes;
ShareEmbed.defaultProps = defaultProps;

export default ShareEmbed;
