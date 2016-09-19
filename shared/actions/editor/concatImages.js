import zlib from 'zlib';
import blobUtil from 'blob-util';
import jpeg from 'jpeg-js';
import randomstring from 'randomstring';

import { Promise } from 'lib/utils';

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
export default function concatImages(imgs, thumbnailIdx = 0) {
  return new Promise((resolve, reject) => {
    // Separator is the boundary of each image in image
    const separator = randomstring.generate(10);
    // Bytes array version of separator, used to concatnate images
    const separatorBytes = stringToUint8Array(separator);
    // Chosen humbnail of images
    let thumbnail;
    // Concatnate images and store in the variable
    const concatImgs = new Buffer(
      imgs.reduce((pre, cur, idx) => {
        const jpegImg = jpeg.encode(cur).data;
        const jpegImgBytes =
          idx === imgs.length -1 ?
          jpegImg :
          concatUint8Array(jpegImg, separatorBytes);

        if (idx === thumbnailIdx) {
          thumbnail = jpegImg;
        }

        return concatUint8Array(pre, jpegImgBytes);
      }, new Uint8Array(0))
    );
    let zip;

    // Use deflate to compress concatImgs
    zlib.deflate(concatImgs, (err, imgZipBuf) => {
      if (err) {
        reject(err);
      }

      // Convert zip file from array buffer to blob, which can be used by multipart
      blobUtil.arrayBufferToBlob(new Uint8Array(imgZipBuf).buffer, 'application/zip').then((imgZipBlob) => {
        zip = imgZipBlob;

        // Convert thumbnail from array buffer to blob.
        return blobUtil.arrayBufferToBlob(thumbnail.buffer, 'image/jpeg');
      }).then((thumbnailBlob) => {
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
