'use strict';

import React, { Component } from 'react';

import COMMON_CONTENT from 'content/common/en-us.json';
import { renderList } from 'lib/utils';
import IconButton from 'components/Common/IconButton';

const CONTENT = COMMON_CONTENT.SHARE.SOCIAL;

if (process.env.BROWSER) {
  require('./ShareSocial.css');
}

const propTypes = {
};

const defaultProps = {
};

class ShareSocial extends Component {
  constructor(props) {
    super(props);
  }

  // Render list of social buutons
  renderBtnsList(propsList) {
    return renderList(propsList, (props, idx) => {
      return (
        <IconButton
          key={idx}
          icon={props.icon}
          className="share-social-btn btn-u btn-brd btn-brd-hover rounded btn-u-sea"
          text={props.text}
        />
      );
    });
  }

  render() {
    const btnsListProps = [{
      icon: 'facebook',
      text: 'Facebook'
    }, {
      icon: 'twitter',
      text: 'Twitter'
    }];
    const btnsList = this.renderBtnsList(btnsListProps);

    return (
      <div className="share-social-component">
        <h5 className="text-center">{CONTENT.SHARE_TO}</h5>
        <div className="container-center-col">
          {btnsList}
        </div>
      </div>
    );
  }
}

ShareSocial.propTypes = propTypes;
ShareSocial.defaultProps = defaultProps;

export default ShareSocial;
