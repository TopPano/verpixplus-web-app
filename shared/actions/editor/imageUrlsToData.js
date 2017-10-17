import async from 'async';

import err from 'constants/err';
import {
  genErr,
  Promise
} from 'lib/utils';

const NUM_CONCURRENT_TASKS = 10;
const PERMITED_ERROR_RATE = 0.3;

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
    let errCount = 0;
    const imgsData = new Array(imgUrls.length);
    const queue = async.queue((task, callback) => {
      imageUrlToDataAsync(task.imgUrl, callback);
    }, NUM_CONCURRENT_TASKS);

    queue.drain = () => {
      if ((errCount / imgUrls.length) < PERMITED_ERROR_RATE) {
        resolve(imgsData);
      } else {
        reject(genErr(err.IMAGE_URLS_TO_DATA_FAILURE));
      }
    }

    imgUrls.forEach((imgUrl, idx) => {
      queue.push({ imgUrl }, (err, result) => {
        if(err) {
          errCount++;
        } else {
          imgsData[idx] = result.imgData;
        }
      });
    });
  });
}
