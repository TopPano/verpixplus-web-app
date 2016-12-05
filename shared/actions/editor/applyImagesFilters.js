import async from 'async';
import range from 'lodash/range';

import {
  applyImageFilters,
  Promise
} from 'lib/utils';

const NUM_CONCURRENT_TASKS = 3;

function applyImageFiltersAsync(storageId, idx, filters, callback) {
  applyImageFilters(storageId, idx, filters, 'image').then((result) => {
    callback(null, {
      appliedImgData: result,
      dataUrl: result
    })
  });
}

export default function applyImagesFilters(storageId, from, to, filters, onProgress) {
  return new Promise((resolve, reject) => {
    if (from >= to) {
      reject(new Error(`from ${from} is larger than to ${to}`));
    }

    const length = to - from;
    const dataUrls = new Array(length);
    const queue = async.queue((task, callback) => {
      applyImageFiltersAsync(task.storageId, task.idx, filters, callback);
    }, NUM_CONCURRENT_TASKS);

    queue.drain = () => {
      resolve({
        dataUrls
      });
    }

    range(from, to).forEach((idx) => {
      queue.push({ storageId, idx }, (err, result) => {
        if(err) {
          reject(err);
        } else {
          onProgress(idx, result.appliedImgData)
          dataUrls[idx] = result.dataUrl;
        }
      });
    });
  });
}
