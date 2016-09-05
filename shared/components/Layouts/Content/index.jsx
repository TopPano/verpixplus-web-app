'use strict';

import React from 'react';

if (process.env.BROWSER) {
  require('./Content.css');
}

export default class Content extends React.Component {
  render() {
    return (
      <div className="content-component">
        {this.props.children}
      </div>
    );
  }
}

Content.displayName = 'Content';

Content.propTypes = {
};
Content.defaultProps = {
};
