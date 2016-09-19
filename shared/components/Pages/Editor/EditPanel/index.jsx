'use strict';

import React, { Component, PropTypes } from 'react';

import EditItemTitle from './EditItemTitle';
import EditItemCaption from './EditItemCaption';
import EditItemFilter from './EditItemFilter';
import EditItemAdjust from './EditItemAdjust';
import EditItemSettings from './EditItemSettings';

if (process.env.BROWSER) {
  require('./EditPanel.css');
}

const propTypes = {
  mediaType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dimension: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  edit: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired
};

const defaultProps = {
};

class EditPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      mediaType,
      title,
      caption,
      data,
      dimension,
      edit,
      create
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
        <EditItemAdjust />
        <EditItemFilter />
        <EditItemSettings
          mediaType={mediaType}
          title={title}
          caption={caption}
          data={data}
          dimension={dimension}
          create={create}
        />
      </div>
    );
  }
}

EditPanel.propTypes = propTypes;
EditPanel.defaultProps = defaultProps;

export default EditPanel;
