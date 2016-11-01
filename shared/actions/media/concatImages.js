import zlib from 'zlib';
import blobUtil from 'blob-util';
import randomstring from 'randomstring';
import base64 from 'base64-js';

import {
  execute,
  Promise
} from 'lib/utils';

const PREFIX = 'data:image/jpeg;base64,';

// Convert string to Uint8Array
function stringToUint8Array(str) {
  const arr = new Uint8Array(str.length);

  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i);
  }

  return arr;
}

// Concatnate two Uint8Array to one
function concatUint8Array(a, b) {
  const newArr = new Uint8Array(a.length + b.length);

  newArr.set(a);
  newArr.set(b, a.length);

  return newArr;
}

// Concatnate a list of images to an image sequence,
// each image is separated by a random string.
export default function concatImages(imgs, handleProgress, thumbnailIdx = 0) {
  return new Promise((resolve, reject) => {
    // Separator is the boundary of each image in image
    const separator = randomstring.generate(10);
    // bytes array version of separator, used to concatnate images
    const separatorBytes = stringToUint8Array(separator);
    let thumbnail;
    // Concatnate images and store in the variable
    const concatImgs = new Buffer(
      imgs.reduce((pre, cur, idx) => {
        const jpegImg = base64.toByteArray(cur.src.slice(PREFIX.length));
        const jpegImgBytes =
          idx === imgs.length -1 ?
          jpegImg :
          concatUint8Array(jpegImg, separatorBytes);

        if (idx === thumbnailIdx) {
          thumbnail = jpegImg;
        }

        execute(handleProgress, idx / (imgs.length + 20));

        return concatUint8Array(pre, jpegImgBytes);
      }, new Uint8Array(0))
    );
    let zip;

    // Use deflate to compress concatImgs
    zlib.deflate(concatImgs, (err, imgZipBuf) => {
      if (err) {
        reject(err);
      }

      execute(handleProgress, (imgs.length + 5) / (imgs.length + 10));

      // Convert zip file from array buffer to blob, which can be used by multipart
      blobUtil.arrayBufferToBlob(new Uint8Array(imgZipBuf).buffer, 'application/zip').then((imgZipBlob) => {
        zip = imgZipBlob;

        execute(handleProgress, (imgs.length + 10) / (imgs.length + 10));

        // Convert thumbnail from array buffer to blob.
        return blobUtil.arrayBufferToBlob(thumbnail.buffer, 'image/jpeg');
      }).then((thumbnailBlob) => {
        execute(handleProgress, 1);
        resolve({
          thumbnail: thumbnailBlob,
          zip,
          separator
        });
      }).catch((err) => {
        reject(err);
      });
    });
  });
}
