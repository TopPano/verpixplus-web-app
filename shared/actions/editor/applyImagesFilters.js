import async from 'async';
import randomstring from 'randomstring';

import {
  applyImageFilters,
  Promise
} from 'lib/utils';

const NUM_CONCURRENT_TASKS = 3;

function applyImageFiltersAsync(img, dimension, filters, callback) {
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
      const dataUrl = canvas.toDataURL('image/jpeg');
      document.body.removeChild(canvas);
      callback(null, {
        appliedImgData,
        dataUrl
      })
    });
  });
}

export default function applyImagesFilters(imgs, dimension, filters) {
  return new Promise((resolve, reject) => {
    const appliedData = new Array(imgs.length);
    const dataUrls = new Array(imgs.length);
    const queue = async.queue((task, callback) => {
      applyImageFiltersAsync(task.img, dimension, filters, callback);
    }, NUM_CONCURRENT_TASKS);

    queue.drain = () => {
      resolve({
        appliedData,
        dataUrls
      });
    }

    imgs.forEach((img, idx) => {
      queue.push({ img }, (err, result) => {
        if(err) {
          reject(err);
        } else {
          console.log(idx);
          appliedData[idx] = result.appliedImgData;
          dataUrls[idx] = result.dataUrl;
        }
      });
    });
  });
}
