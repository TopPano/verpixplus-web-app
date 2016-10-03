'use strict';

import React, { Component, PropTypes } from 'react';

import Livephoto from 'components/Common/Livephoto';

if (process.env.BROWSER) {
  require('./PlayerPanel.css');
}

const propTypes = {
  imagesData: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  filters: PropTypes.object.isRequired
};

const defaultProps = {
};

class PlayerPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      imagesData,
      filters
    } = this.props;

    return (
      <div className="player-panel-component bg-color-light container-center-col">
        <Livephoto
          photos={imagesData}
          filters={filters}
        />
      </div>
    );
  }
}

PlayerPanel.propTypes = propTypes;
PlayerPanel.defaultProps = defaultProps;

export default PlayerPanel;
