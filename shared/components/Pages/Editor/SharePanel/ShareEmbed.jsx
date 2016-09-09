'use strict';

import React, { Component } from 'react';
import isInteger from 'lodash/isInteger';
import toNumber from 'lodash/toNumber';

import EDITOR_CONTENT from 'content/editor/en-us.json';
import { EMBED } from 'constants/editor';
import SidebarItem from '../SidebarItem';
import ShareEmbedCode from './ShareEmbedCode';

const CONTENT = EDITOR_CONTENT.SHARE_PANEL.EMBED;

if (process.env.BROWSER) {
  require('./ShareEmbed.css');
}

const propTypes = {
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
    const { embedWidth, embedHeight } = this.state;
    // TODO: dynamic id and type for usageCode
    const usageCode = this.genUsageCode('abcdefg','livephoto', embedWidth, embedHeight);

    return (
      <div className="share-embed-component">
        <SidebarItem
          icon="code"
          title={CONTENT.TITLE}
        >
          <ShareEmbedCode
            title={CONTENT.INSTALL}
            text={EMBED.SDK}
          />
          <ShareEmbedCode
            title={CONTENT.USAGE}
            text={usageCode}
          />
          <div className="margin-bottom-10" />
          <div className="inputs-wrapper">
            <input
              ref="inputWidth"
              type="text"
              className="form-control bg-color-light-grey"
              value={embedWidth}
              onChange={this.handleSizeChange}
            />
            <i className="fa fa-times margin-left-5 margin-right-5" />
            <input
              ref="inputHeight"
              type="text"
              className="form-control bg-color-light-grey"
              value={embedHeight}
              onChange={this.handleSizeChange}
            />
          </div>
        </SidebarItem>
      </div>
    );
  }
}

ShareEmbed.propTypes = propTypes;
ShareEmbed.defaultProps = defaultProps;

export default ShareEmbed;
