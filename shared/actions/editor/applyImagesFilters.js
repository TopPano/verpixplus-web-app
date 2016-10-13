import randomstring from 'randomstring';

import {
  applyImageFilters,
  Promise
} from 'lib/utils';

export default function applyImagesFilters(imgs, dimension, filters) {
  return new Promise((resolve) => {
    const appliedData = new Array(imgs.length);
    const dataUrls = new Array(imgs.length);
    let counter = 0;

    imgs.forEach((img, idx) => {
      const canvas = document.createElement('CANVAS');
      const id = randomstring.generate({
        length: 20,
        charset: 'alphabetic'
      });

      canvas.setAttribute('id', id);
      canvas.width = dimension.width;
      canvas.height = dimension.height;
      canvas.style.display = 'none';
      canvas.style.visibility = 'hidden';
      document.body.appendChild(canvas);

      Caman(`#${id}`, function () {
        applyImageFilters(this, img, dimension, filters).then((appliedImgData) => {
          appliedData[idx] = appliedImgData;
          dataUrls[idx] = canvas.toDataURL('image/jpeg');
          counter++;
          document.body.removeChild(canvas);
          if (counter === imgs.length) {
            resolve({
              appliedData,
              dataUrls
            });
          }
        });
      });
    });
  });
}
