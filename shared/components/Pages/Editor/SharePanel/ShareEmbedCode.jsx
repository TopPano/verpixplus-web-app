'use strict';

import React, { Component, PropTypes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import classNames from 'classnames';

import EDITOR_CONTENT from 'content/editor/en-us.json';

if (process.env.BROWSER) {
  require('./ShareEmbedCode.css');
}

const propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

const defaultProps = {
};

class ShareEmbedCode extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      isCopied: false
    };
  }

  handleCopy = () => {
    clearTimeout(this.timer);
    this.setState({
      isCopied: true
    });
    this.timer = setTimeout(() => {
      this.setState({
        isCopied: false
      });
    }, 1000);
  }

  render() {
    const { isCopied } = this.state;
    const { title, text } = this.props;
    const copiedClass = classNames({
      'copied': true,
      'bg-color-light-grey': true,
      'rounded': true,
      'active': isCopied
    });

    return (
      <div className="share-embed-code-component heading">
        <h5><strong className="title">{title}</strong></h5>
        <CopyToClipboard
          text={text}
          onCopy={this.handleCopy}
        >
          <div className="text-wrapper clickable">
            <textarea
              className="form-control bg-color-light-grey clickable"
              rows="4"
              readOnly
              value={text}
            />
            <div className="text-cover rounded container-center-col bg-color-darker">
              <i className="copy icon-lg fa fa-copy" />
            </div>
            <h5 className={copiedClass}>
              <i className="fa fa-check-circle-o" />
              {`${EDITOR_CONTENT.SHARE_PANEL.EMBED.COPIED} `}
            </h5>
          </div>
        </CopyToClipboard>
      </div>
    );
  }
}

ShareEmbedCode.propTypes = propTypes;
ShareEmbedCode.defaultProps = defaultProps;

export default ShareEmbedCode;
