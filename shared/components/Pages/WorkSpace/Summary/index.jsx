'use strict';

import React, { Component, PropTypes } from 'react';

import { renderList } from 'lib/utils';

if (process.env.BROWSER) {
  require('./Summary.css');
}

const propTypes = {
  username: PropTypes.string.isRequired,
  numOfMedia: PropTypes.number.isRequired
};

const defaultProps = {
};

class Summary extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);
  }

  // Render list of summary-info
  renderSummaryInfoList(propsList) {
    return renderList(propsList, (props, idx) => (
      <div
        id={idx}
        className="summary-info"
      >
        <img
          src={props.src}
          alt={props.alt}
          width={props.size}
          height={props.size}
        />
        <span>{props.text}</span>
      </div>
    ));
  }

  render() {
    const { l } = this.context.i18n;
    const {
      username,
      numOfMedia
    } = this.props;
    const summaryInfoPropsList = [{
      src: '/static/images/workspace/username.png',
      alt: 'username',
      size: 17,
      text: username
    }, {
      src: '/static/images/workspace/media.svg',
      alt: 'media',
      size: 15,
      text: `${numOfMedia} ${l('Media').toUpperCase()}`
    }];
    const summaryInfoList = this.renderSummaryInfoList(summaryInfoPropsList);

    return (
      <div className="summary-component">
        {summaryInfoList}
      </div>
    );
  }
}

Summary.propTypes = propTypes;
Summary.defaultProps = defaultProps;

export default Summary;
