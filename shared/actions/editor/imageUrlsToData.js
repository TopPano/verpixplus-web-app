import async from 'async';

import { Promise } from 'lib/utils';

const NUM_CONCURRENT_TASKS = 10;

function imageUrlToDataAsync(imgUrl, dimension, callback) {
  const {
    width,
    height
  } = dimension;
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('CANVAS');
    const canvasCtx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    canvasCtx.drawImage(img, 0, 0);

    callback(null, {
      imgData: canvasCtx.getImageData(0, 0, width, height)
    });
  };
  img.onerror = (e) => {
    callback(e);
  }
  img.crossOrigin = 'Anonymous';
  img.src = imgUrl;
}

export default function imageUrlsToData(imgUrls, dimension) {

  return new Promise((resolve, reject) => {
    const imgsData = new Array(imgUrls.length);
    const queue = async.queue((task, callback) => {
      imageUrlToDataAsync(task.imgUrl, dimension, callback);
    }, NUM_CONCURRENT_TASKS);

    queue.drain = () => {
      resolve(imgsData);
    }

    imgUrls.forEach((imgUrl, idx) => {
      queue.push({ imgUrl }, (err, result) => {
        if(err) {
          reject(err);
        } else {
          imgsData[idx] = result.imgData;
        }
      });
    });
  });
}
