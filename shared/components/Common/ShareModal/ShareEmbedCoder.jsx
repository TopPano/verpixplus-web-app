'use strict';

import React, { Component, PropTypes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import classNames from 'classnames';

if (process.env.BROWSER) {
  require('./ShareEmbedCoder.css');
}

const propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

const defaultProps = {
};

class ShareEmbedCoder extends Component {
  static contextTypes = { i18n: PropTypes.object };

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
    const { l } = this.context.i18n;
    const { isCopied } = this.state;
    const {
      title,
      text
    } = this.props;
    const copiedClass = classNames({
      'copied': true,
      'active': isCopied
    });

    return (
      <div className="share-embed-coder-component heading">
        <h5>{title}</h5>
        <CopyToClipboard
          text={text}
          onCopy={this.handleCopy}
        >
          <div className="text-wrapper clickable">
            <textarea
              className="form-control clickable"
              rows="4"
              value={text}
            />
            <div className="text-cover container-center-col">
              <i className="copy icon-lg fa fa-clipboard" />
            </div>
            <h5 className={copiedClass}>
              {l('Copied')}
            </h5>
          </div>
        </CopyToClipboard>
      </div>
    );
  }
}

ShareEmbedCoder.propTypes = propTypes;
ShareEmbedCoder.defaultProps = defaultProps;

export default ShareEmbedCoder;
