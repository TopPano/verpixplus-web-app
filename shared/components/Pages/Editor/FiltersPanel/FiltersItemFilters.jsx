'use strict';

import React, { Component, PropTypes } from 'react';
import range from 'lodash/range';

import EDITOR_CONTENT from 'content/editor/en-us.json';
import ImageCarousel from 'components/Common/ImageCarousel';
import SidebarItem from '../SidebarItem';

const CONTENT = EDITOR_CONTENT.FILTERS_PANEL.FILTERS;

if (process.env.BROWSER) {
  require('./FiltersItemFilters.css');
}

const propTypes = {
};

const defaultProps = {
};

class FiltersItemFilters extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const images = range(0, 10).map((cur) => {
      return {
        src: 'http://placekitten.com/g/400/200',
        text: `filter${cur}`
      };
    });
    const imgCarouselProps = {
      images,
      carouselClass: 'filter-carousel',
      imageClass: 'filter-image',
      rounded: true,
      isVertical: true
    };

    return (
      <div className="filters-item-filters-component">
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

FiltersItemFilters.propTypes = propTypes;
FiltersItemFilters.defaultProps = defaultProps;

export default FiltersItemFilters;
