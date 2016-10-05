import isFunction from 'lodash/isFunction';
import forEach from 'lodash/forEach';

import { Promise } from 'lib/utils';

export default function applyImageFilters(caman, img, dimension, filters) {
  return new Promise((resolve) => {
    const {
      width,
      height
    } = dimension;
    const ctx = caman.canvas.getContext('2d');

    ctx.putImageData(img, 0, 0, 0, 0, width, height);
    caman.reloadCanvasData();

    forEach(filters.adjusts, (value, key) => {
      if (isFunction(caman[key])) {
        caman[key](value);
      }
    });

    caman.render(() => {
      resolve(ctx.getImageData(0, 0, width, height));
    });
  });
}
