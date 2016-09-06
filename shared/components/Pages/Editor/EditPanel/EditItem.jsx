'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./EditItem.css');
}

const propTypes = {
};

const defaultProps = {
};

class EditItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="edit-item-component">
      </div>
    );
  }
}

EditItem.propTypes = propTypes;
EditItem.defaultProps = defaultProps;

export default EditItem;
