import async from 'async';

import { Promise } from 'lib/utils';

const NUM_CONCURRENT_TASKS = 10;

function imageUrlToDataAsync(imgUrl, callback) {
  const img = new Image();

  img.onload = () => {
    callback(null, {
      imgData: img
    });
  };
  img.onerror = (e) => {
    callback(e);
  }
  img.src = imgUrl;
}

export default function imageUrlsToData(imgUrls) {

  return new Promise((resolve, reject) => {
    const imgsData = new Array(imgUrls.length);
    const queue = async.queue((task, callback) => {
      imageUrlToDataAsync(task.imgUrl, callback);
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
