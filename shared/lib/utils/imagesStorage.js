import localforage from 'localforage';
import isNumber from 'lodash/isNumber';

import { Promise } from 'lib/utils';

// Store all images in memory that can not be stored by localforage
const imgsStorage = new Map();
// Store the maximum index of each storage
const maxIndexes = new Map();

function getKey(storageId, idx) {
  return `verpixplus/${storageId}/img${idx}`;
}

function load(storageId, idx) {
  const key = getKey(storageId, idx);
  const imgDataUrl = imgsStorage.get(key);

  if (imgDataUrl) {
    return new Promise((resolve) => {
      resolve(imgDataUrl);
    });
  } else {
    return localforage.getItem(key);
  }
}

function save(storageId, idx, imgDataUrl, inMemory) {
  return new Promise((resolve) => {
    const key = getKey(storageId, idx);
    const currentMaxIdx = maxIndexes.get(storageId);

    if (!isNumber(currentMaxIdx) || currentMaxIdx < idx) {
      maxIndexes.set(storageId, idx);
    }

    if (inMemory) {
      imgsStorage.set(key, imgDataUrl);
      resolve();
    }

    localforage.setItem(key, imgDataUrl).then(() => {
      resolve();
    }).catch(() => {
      // TODO: Handle more errors
      imgsStorage.set(key, imgDataUrl);
      resolve();
    });
  });
}

function remove(storageId, idx) {
  const key = getKey(storageId, idx);

  if (imgsStorage.get(key)) {
    return new Promise((resolve) => {
      imgsStorage.delete(key);
      resolve();
    });
  } else {
    return localforage.removeItem(key);
  }
}

function clear(storageId) {
  const maxIdx = maxIndexes.get(storageId);

  if (isNumber(maxIdx)) {
    for (let idx = 0;idx <= maxIdx; idx++) {
      remove(storageId, idx);
    }
  }
}

export default {
  load,
  save,
  remove,
  clear
};
