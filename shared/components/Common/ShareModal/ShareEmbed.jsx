'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import isInteger from 'lodash/isInteger';
import toNumber from 'lodash/toNumber';
import fileSaver from 'file-saver';
import fetch from 'isomorphic-fetch';
import JSZip from 'jszip';

import {
  MEDIA_TYPE,
  EMBED
} from 'constants/common';
import Livephoto from 'components/Common/Livephoto';
import Panophoto from 'components/Common/Panophoto';
import FlatButton from 'components/Common/FlatButton';
import ShareEmbedCoder from './ShareEmbedCoder';
import genAdHTML from './genAdHTML';

if (process.env.BROWSER) {
  require('./ShareEmbed.css');
}

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  shareUrl: PropTypes.string.isRequired,
  altPhotoUrl: PropTypes.string
};

const defaultProps = {
};

class ShareEmbed extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleLivephotoSizeChange = this.handleLivephotoSizeChange.bind(this);
    this.handlePanophotoSizeChange = this.handlePanophotoSizeChange.bind(this);
    this.handleClickTagChange = this.handleClickTagChange.bind(this);
    this.handleClickPreviewBtn = this.handleClickPreviewBtn.bind(this);
    this.handleClickDownloadBtn = this.handleClickDownloadBtn.bind(this);
    this.setCutBased = this.setCutBased.bind(this);

    // Initialize state
    this.state = {
      showPreview: false,
      liveWidth: EMBED.DEFAULT_WIDTH_LIVEPHOTO,
      liveHeight: EMBED.DEFAULT_HEIGHT_LIVEPHOTO,
      panoLength: EMBED.DEFAULT_WIDTH_PANOPHOTO,
      cutBased: 'width',
      clickTag: ''
    };
  }

  // Hndler for livephoto size change
  handleLivephotoSizeChange() {
    const {
      liveWidth,
      liveHeight
    } = this.state;
    const newLiveWidth = toNumber(this.refs.inputLiveWidth.value);
    const newLiveHeight = toNumber(this.refs.inputPanoHeight.value);
    this.setState({
      liveWidth: isInteger(newLiveWidth) ? newLiveWidth : liveWidth,
      liveHeight: isInteger(newLiveHeight) ? newLiveHeight : liveHeight
    });
  }

  // Hndler for panophoto size change
  handlePanophotoSizeChange() {
    const newPanoLength = toNumber(this.refs.inputPanoLength.value);
    this.setState({
      panoLength: isInteger(newPanoLength) ? newPanoLength : this.state.panoLength
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
    const {
      mediaId,
      mediaType,
      altPhotoUrl
    } = this.props;
    const {
      liveWidth,
      liveHeight,
      panoLength,
      cutBased,
      clickTag
    } = this.state;
    const embedWidth = (mediaType === MEDIA_TYPE.LIVE_PHOTO) ? liveWidth : panoLength;
    const embedHeight = (mediaType === MEDIA_TYPE.LIVE_PHOTO) ? liveHeight : panoLength;
    const sdkCode = this.genSDKCode(mediaType);
    const usageCode = this.genUsageCode(mediaId, mediaType, embedWidth, embedHeight, cutBased, 'assets/alt.jpg');
    const zip = new JSZip();

    fetch(altPhotoUrl, {
      headers: {
        'Accept': 'image/jpeg'
      }
    }).then((res) => {
      if (res.status >= 400) {
        throw new Error(res);
      }
      return res.arrayBuffer();
    }).then((altPhoto) => {
      zip.file('index.html', genAdHTML(clickTag, usageCode, sdkCode));
      zip.file('assets/alt.jpg', altPhoto);

      return zip.generateAsync({
        type: 'blob'
      });
    }).then((zipBlob) => {
      fileSaver.saveAs(zipBlob, `ad-${mediaId}.zip`);
    }).catch(() => {
      // TODO: Error handling
    });
  }

  // Set value cutBased state
  setCutBased(cutBased) {
    this.setState({ cutBased });
  }

  // Generate the iframe code
  genIframeCode(mediaType, shareUrl, embedWidth, embedHeight, cutBased) {
    const queryCutBased =
      ((mediaType === MEDIA_TYPE.LIVE_PHOTO) && (cutBased === 'height')) ?
      `?cutBased=${cutBased}` :
      '';
    return `<iframe width="${embedWidth}" height="${embedHeight}" src="${shareUrl}${queryCutBased}" frameborder="0" scrolling="no" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`;
  }

  // Generate the SDK code
  genSDKCode(mediaType) {
    return (
      (mediaType === MEDIA_TYPE.LIVE_PHOTO) ?
      EMBED.SDK_LIVEPHOTO :
      EMBED.SDK_PANOPHOTO
    );
  }

  // Generate the usage code
  genUsageCode(id, mediaType, width, height, cutBased, altPhoto = '') {
    const typeName = (mediaType === MEDIA_TYPE.LIVE_PHOTO) ? 'livephoto' : 'panophoto';
    const dataWidth = width > 0 ? `data-width="${width}"` : '';
    const dataHeight = height > 0 ? `data-height="${height}"` : '';
    const dataCutBased =
      ((mediaType === MEDIA_TYPE.LIVE_PHOTO) && (cutBased === 'height')) ?
      `data-cut-based="${cutBased}"` :
      '';
    const dataAltPhoto = altPhoto ? `data-alt-photo="${altPhoto}"` : '';

    return `<div class="verpix-${typeName}" data-id="${id}" ${dataWidth} ${dataHeight} ${dataAltPhoto} ${dataCutBased}></div>`;
  }

  // Render inputs for choose value of "cutBased"
  renderCutBasedInputs(cutBased) {
    const { l } = this.context.i18n;

    return (
      <div className="inputs-wrapper container-center-col">
        <p>{`${l('Crop based')}:`}</p>
        <div
          className="radio"
          onClick={() => { this.setCutBased('width') }}
        >
          <label>
            <input
              type="radio"
              value="width"
              checked={cutBased === 'width'}
            />{l('Width')}
          </label>
        </div>
        <div
          className="radio"
          onClick={() => { this.setCutBased('height') }}
        >
          <label>
            <input
              type="radio"
              value="height"
              checked={cutBased === 'height'}
            />{l('Height')}
          </label>
        </div>
      </div>
    );
  }

  render() {
    const { l } = this.context.i18n;
    const {
      showPreview,
      liveWidth,
      liveHeight,
      panoLength,
      cutBased,
      clickTag
    } = this.state;
    const {
      mediaId,
      mediaType,
      shareUrl
    } = this.props;
    const embedWidth = (mediaType === MEDIA_TYPE.LIVE_PHOTO) ? liveWidth : panoLength;
    const embedHeight = (mediaType === MEDIA_TYPE.LIVE_PHOTO) ? liveHeight : panoLength;
    const iframeCode = this.genIframeCode(mediaType, shareUrl, embedWidth, embedHeight, cutBased);
    const sdkCode = this.genSDKCode(mediaType);
    const usageCode = this.genUsageCode(mediaId, mediaType, embedWidth, embedHeight, cutBased);
    const cutBasedInputs = this.renderCutBasedInputs(cutBased);
    const playerClass = classNames({
      'preview-player': true,
      'active': showPreview
    });
    const player =
      (mediaType === MEDIA_TYPE.LIVE_PHOTO) ?
      <Livephoto
        mediaId={mediaId}
        width={liveWidth}
        height={liveHeight}
        cutBased={cutBased}
      /> :
      <Panophoto
        mediaId={mediaId}
        width={panoLength}
        height={panoLength}
      />
    const codersStyle = {
      display: !showPreview ? 'block' : 'none'
    };

    return (
      <div className="share-embed-component">
        <div className="container-center-row">
          <div className={playerClass}>
            {player}
          </div>
        </div>
        <div style={codersStyle}>
          <p className="embed-title container-center-col">{l('Embed in iframe')}</p>
          <ShareEmbedCoder text={iframeCode} />
          <hr />
          <p className="embed-title container-center-col">{l('Embed by SDK')}</p>
          <ShareEmbedCoder
            title={`1. ${l('SDK Installation')}`}
            text={sdkCode}
          />
          <ShareEmbedCoder
            title={`2. ${l('Usage')}`}
            text={usageCode}
          />
        </div>
        <hr />
        <div className="margin-bottom-10" />
        {
          (mediaType === MEDIA_TYPE.LIVE_PHOTO) &&
          <div className="inputs-wrapper container-center-col">
            <p>{`${l('Size')}:`}</p>
            <input
              ref="inputLiveWidth"
              type="text"
              className="form-control"
              value={liveWidth}
              onChange={this.handleLivephotoSizeChange}
            />
            <i className="fa fa-times margin-left-5 margin-right-5" />
            <input
              ref="inputPanoHeight"
              type="text"
              className="form-control"
              value={liveHeight}
              onChange={this.handleLivephotoSizeChange}
            />
          </div>
        }
        {
          (mediaType === MEDIA_TYPE.PANO_PHOTO) &&
          <div className="inputs-wrapper container-center-col">
            <p>{`${l('Size')}:`}</p>
            <input
              ref="inputPanoLength"
              type="text"
              className="form-control"
              value={panoLength}
              onChange={this.handlePanophotoSizeChange}
            />
          </div>
        }
        { (mediaType === MEDIA_TYPE.LIVE_PHOTO) && cutBasedInputs }
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
