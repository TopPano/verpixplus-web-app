'use strict';

import React, { Component, PropTypes } from 'react';

import EditItemSettings from 'containers/pages/Editor/EditItemSettings';
import EditItemTitle from './EditItemTitle';
import EditItemCaption from './EditItemCaption';

if (process.env.BROWSER) {
  require('./EditPanel.css');
}

const propTypes = {
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  edit: PropTypes.func.isRequired
};

const defaultProps = {
};

class EditPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      caption,
      edit
    } = this.props;

    return (
      <div className="edit-panel-component">
        <EditItemTitle
          title={title}
          edit={edit}
        />
        <EditItemCaption
          caption={caption}
          edit={edit}
        />
        <EditItemSettings />
      </div>
    );
  }
}

EditPanel.propTypes = propTypes;
EditPanel.defaultProps = defaultProps;

export default EditPanel;
