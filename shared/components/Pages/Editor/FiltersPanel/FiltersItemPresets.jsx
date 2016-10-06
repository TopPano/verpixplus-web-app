'use strict';

import React, { Component, PropTypes } from 'react';

import EDITOR_CONTENT from 'content/editor/en-us.json';
import ImageCarousel from 'components/Common/ImageCarousel';
import SidebarItem from '../SidebarItem';

const CONTENT = EDITOR_CONTENT.FILTERS_PANEL.PRESETS;

if (process.env.BROWSER) {
  require('./FiltersItemPresets.css');
}

const propTypes = {
  filters: PropTypes.object.isRequired,
  adjustFilters: PropTypes.func.isRequired
};

const defaultProps = {
};

const PRESETS = [
  { name: 'normal', text: CONTENT.NORMAL },
  { name: 'vintage', text: CONTENT.VINTAGE },
  { name: 'lomo', text: CONTENT.LOMO },
  { name: 'clarity', text: CONTENT.CLARITY },
  { name: 'sinCity', text: CONTENT.SIN_CITY },
  { name: 'sunrise', text: CONTENT.SUNRISE },
  { name: 'crossProcess', text: CONTENT.CROSS_PROCESS },
  { name: 'orangePeel', text: CONTENT.ORANGE_PEEL },
  { name: 'love', text: CONTENT.LOVE },
  { name: 'grungy', text: CONTENT.GRUNGY },
  { name: 'jarques', text: CONTENT.JARQUES },
  { name: 'pinhole', text: CONTENT.PINHOLE },
  { name: 'oldBoot', text: CONTENT.OLD_BOOT },
  { name: 'glowingSun', text: CONTENT.GLOWING_SUN },
  { name: 'hazyDays', text: CONTENT.HAZY_DAYS },
  { name: 'herMajesty', text: CONTENT.HER_MAJESTY },
  { name: 'nostalgia', text: CONTENT.NOSTALGIA },
  { name: 'hemingway', text: CONTENT.HEMINGWAY },
  { name: 'concentrate', text: CONTENT.CONCENTRATE }
];

class FiltersItemPresets extends Component {
  constructor(props) {
    super(props);

    // Bind "this" to member functions
    this.handleClick = this.handleClick.bind(this);
  }

  // handler for clicking a preset
  handleClick(idx) {
    const {
      filters,
      adjustFilters
    } = this.props;
    const presetName = PRESETS[idx].name;

    if (filters.preset !== presetName) {
      adjustFilters({
        preset: presetName
      });
    }
  }

  render() {
    const images = PRESETS.map((preset) => {
      return {
        src: `/static/images/editor/filters/${preset.name}.jpg`,
        text: preset.text
      };
    });
    const imgCarouselProps = {
      images,
      carouselClass: 'filter-carousel',
      rounded: true,
      isVertical: true,
      onClick: this.handleClick
    };

    return (
      <div className="filters-item-presets-component">
        <SidebarItem
          icon="filter"
          title={CONTENT.TITLE}
        >
          <ImageCarousel {...imgCarouselProps} />
        </SidebarItem>
      </div>
    );
  }
}

FiltersItemPresets.propTypes = propTypes;
FiltersItemPresets.defaultProps = defaultProps;

export default FiltersItemPresets;
