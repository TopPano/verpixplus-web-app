import { Promise } from 'lib/utils';
import isInteger from 'lodash/isInteger';

export default function imageBlobToBase64(imgBlob, shortSideLengthMax, cropToSquare) {
  return new Promise((resolve, reject) => {
    // TODO: Check type of imgBlob
    const img = new Image();
    img.onload = () => {
      const isLandscape = img.width > img.height;
      // Crop range of source image
      let imgX = 0;
      let imgY = 0;
      let imgWidth = img.width;
      let imgHeight = img.height;
      // Crop range of destination canvas
      let canvasWidth = img.width;
      let canvasHeight = img.height;

      // Resize the image if necessary
      if (shortSideLengthMax) {
        if (!isInteger(shortSideLengthMax)) {
          reject(new Error(`The value of shortSideLengthMax (${shortSideLengthMax}) is not a integer`));
        }
        if (shortSideLengthMax <= 0) {
          reject(new Error(`The value of shortSideLengthMax (${shortSideLengthMax}) is not a postive integer`));
        }
        if (isLandscape) {
          if (canvasHeight > shortSideLengthMax) {
            canvasWidth = parseInt(canvasWidth * (shortSideLengthMax / canvasHeight), 10);
            canvasHeight = shortSideLengthMax;
          }
        } else {
          if (canvasWidth > shortSideLengthMax) {
            canvasWidth = shortSideLengthMax;
            canvasHeight = parseInt(canvasHeight * (shortSideLengthMax / canvasWidth), 10);
          }
        }
      }

      // Change the value of crop range if crop to rectangle
      if (cropToSquare) {
        if (isLandscape) {
          imgX = parseInt((imgWidth - imgHeight) / 2, 10);
          canvasWidth = canvasHeight;
          imgWidth = imgHeight;
        } else {
          imgY = parseInt((imgHeight - imgWidth) / 2, 10);
          canvasHeight = canvasWidth;
          imgHeight = imgWidth;
        }
      }

      const canvas = document.createElement('CANVAS');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.getContext('2d').drawImage(img, imgX, imgY, imgWidth, imgHeight, 0, 0, canvasWidth, canvasHeight);

      resolve(canvas.toDataURL('image/jpeg'), 1);
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = imgBlob.preview;
  });
}
