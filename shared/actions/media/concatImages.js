import threads from 'threads';
import blobUtil from 'blob-util';
import randomstring from 'randomstring';

import {
  execute,
  Promise
} from 'lib/utils';


// Convert string to Uint8Array
function stringToUint8Array(str) {
  const arr = new Uint8Array(str.length);

  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i);
  }

  return arr;
}

// Concatnate images into one
// XXX:
// The code is so ugly because we can not use external variables or resoueces in WebWorker,
// please help to make code more clear.
function concatImagesBackground(input, done, progress) {
  // Prefix of image data url
  const PREFIX = 'data:image/jpeg;base64,';
  const {
    imgsDataUrls,
    separatorBytes,
    thumbnailIdx
  } = input;

  const base64ToByteArray = (b64) => {
    // Code for base64
    const CODE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    // Reversed lookup table for base64 conversion
    const revLookup = []
    const len = b64.length;
    const placeHoldersCount = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
    const arr = new Uint8Array(len * 3 / 4 - placeHoldersCount);

    // Fill reversed lookup table
    for (let idx = 0; idx < CODE.length; idx++) {
      revLookup[CODE.charCodeAt(idx)] = idx;
    }
    revLookup['-'.charCodeAt(0)] = 62;
    revLookup['_'.charCodeAt(0)] = 63;

    let i, j, l;
    let L = 0;

    // if there are placeHoldersCount, only get up to the last complete 4 chars
    l = placeHoldersCount > 0 ? len - 4 : len;

    for (i = 0, j = 0; i < l; i += 4, j += 3) {
      const tmp =
        (revLookup[b64.charCodeAt(i)] << 18) |
        (revLookup[b64.charCodeAt(i + 1)] << 12) |
        (revLookup[b64.charCodeAt(i + 2)] << 6) |
        revLookup[b64.charCodeAt(i + 3)];
      arr[L++] = (tmp >> 16) & 0xFF;
      arr[L++] = (tmp >> 8) & 0xFF;
      arr[L++] = tmp & 0xFF;
    }

    if (placeHoldersCount === 2) {
      const tmp =
        (revLookup[b64.charCodeAt(i)] << 2) |
        (revLookup[b64.charCodeAt(i + 1)] >> 4);
      arr[L++] = tmp & 0xFF;
    } else if (placeHoldersCount === 1) {
      const tmp =
        (revLookup[b64.charCodeAt(i)] << 10) |
        (revLookup[b64.charCodeAt(i + 1)] << 4) |
        (revLookup[b64.charCodeAt(i + 2)] >> 2);
      arr[L++] = (tmp >> 8) & 0xFF;
      arr[L++] = tmp & 0xFF;
    }

    return arr;
  }
  const concatUint8Array = (a, b) => {
    const newArr = new Uint8Array(a.length + b.length);

    newArr.set(a);
    newArr.set(b, a.length);

    return newArr;
  };

  let thumbnailBytes;
  const imgsBytes = imgsDataUrls.map((imgBase64) => base64ToByteArray(imgBase64.slice(PREFIX.length)));
  const concatImgsBytes = imgsBytes.reduce((pre, imgBytes, idx) => {
    // Append separator to each image except for last one
    const imgBytesWithSeparator =
      idx === imgsBytes.length -1 ?
      imgBytes :
      concatUint8Array(imgBytes, separatorBytes);

    if (idx === thumbnailIdx) {
      thumbnailBytes = imgBytes;
    }
    // Update progress per 20 images to prevent UI updating too frequentyly
    if ((idx % 20) === 0) {
      progress(idx);
    }

    return concatUint8Array(pre, imgBytesWithSeparator);
  }, new Uint8Array(0));

  done({
    concatImgsBytes,
    thumbnailBytes
  });
}

// Concatnate a list of images to an image sequence,
// each image is separated by a random string.
export default function concatImages(imgs, handleProgress, thumbnailIdx = 0) {
  return new Promise((resolve, reject) => {
    // Separator is the boundary of each image in image
    const separator = randomstring.generate(10);
    // bytes array version of separator, used to concatnate images
    const separatorBytes = stringToUint8Array(separator);
    // Bytes array version of images
    // const imgsBytes = imgs.map((img) => base64.toByteArray(img.src.slice(PREFIX.length)));
    const imgsDataUrls = imgs.map((img) => img.src);
    // Concatenate images in background
    const concatThread = threads.spawn(concatImagesBackground);
    concatThread.send({
      imgsDataUrls,
      separatorBytes,
      thumbnailIdx
    }).on('progress', (progress) => {
      execute(handleProgress, progress / (imgs.length + 20));
    }).on('message', (res) => {
      concatThread.kill();

      const {
        concatImgsBytes,
        thumbnailBytes
      } = res;
      let concatImgs;

      // Convert concatenated images from array buffer to blob, which can be used by multipart
      blobUtil.arrayBufferToBlob(concatImgsBytes.buffer, 'image/jpeg').then((concatImgsBlob) => {
        concatImgs = concatImgsBlob;

        execute(handleProgress, (imgs.length + 10) / (imgs.length + 15));

        // Convert thumbnail from array buffer to blob.
        return blobUtil.arrayBufferToBlob(thumbnailBytes.buffer, 'image/jpeg');
      }).then((thumbnailBlob) => {
        execute(handleProgress, 1);
        resolve({
          thumbnail: thumbnailBlob,
          concatImgs,
          separator
        });
      }).catch((err) => {
        reject(err);
      });
    }).on('error', (err)=> {
      reject(err);
    });
  });
}
