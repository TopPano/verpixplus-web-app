'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import isInteger from 'lodash/isInteger';
import toNumber from 'lodash/toNumber';

import COMMON_CONTENT from 'content/common/en-us.json';
import { EMBED } from 'constants/editor';
import IconButton from 'components/Common/IconButton';
import ShareEmbedCoder from './ShareEmbedCoder';

const CONTENT = COMMON_CONTENT.SHARE.EMBED;

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

    // Initialize state
    this.state = {
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

  // Generate the usage code
  genUsageCode(id, type, width, height) {
    const dataWidth = width > 0 ? `data-width="${width}"` : '';
    const dataHeight = height > 0 ? `data-height="${height}"` : '';

    return `<div class="verpix-${type}" data-id="${id}" ${dataWidth} ${dataHeight}></div>`;
  }

  render() {
    const {
      embedWidth,
      embedHeight
    } = this.state;
    const { mediaId } = this.props;
    const usageCode = this.genUsageCode(mediaId,'livephoto', embedWidth, embedHeight);

    return (
      <div className="share-embed-component">
        <ShareEmbedCoder
          title={CONTENT.INSTALL}
          text={EMBED.SDK}
        />
        <hr />
        <ShareEmbedCoder
          title={CONTENT.USAGE}
          text={usageCode}
        />
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
          <Link
            to={`http://developer.verpixplus.me/embed/index.html?mediaId=${mediaId}&width=${embedWidth}&height=${embedHeight}`}
            target="_blank"
          >
            <IconButton
              className="btn-u btn-brd btn-brd-hover rounded btn-u-sea"
              icon="fa fa-eye"
              text={CONTENT.PREVIEW}
            />
          </Link>
        </div>
      </div>
    );
  }
}

ShareEmbed.propTypes = propTypes;
ShareEmbed.defaultProps = defaultProps;

export default ShareEmbed;
