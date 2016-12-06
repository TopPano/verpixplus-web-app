import {
  Promise,
  imagesStorage,
  genErr,
  genRandomNum,
  execute
} from 'lib/utils';
import ERR from 'constants/err';

export default class PanoConverter {
  constructor() {
    this.isConverting = false;
    this.timer = null;
  }

  convert(storageId, source, handleProgress) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('CANVAS');
      let ratio;
      let imgData;
      let progress = 0;

      this.timer = setInterval(() => {
        const addedProgress = genRandomNum(0.2, 0.3);
        progress = ((progress + addedProgress) < 0.99) ? (progress + addedProgress) : 0.99;
        handleProgress(progress);
      }, 100);

      img.onload = () => {
        // Check the aspect ratio of panorama is valid or not
        ratio = img.width / img.height;
        if(ratio > 2.02 && ratio < 1.98) {
          this.stop();
          reject(genErr(ERR.INVALID_PANO_RATIO));
        }

        // Get base64 data from image
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        imgData = canvas.toDataURL('image/jpeg', 1);

        // Save image data to local storage
        imagesStorage.save(storageId, 0, imgData, true).then(() => {
          execute(handleProgress, 1);
          this.stop();
          resolve({
            data: [imgData],
            dimension: {
              width: img.width,
              height: img.height
            }
          });
        }).catch((err) => {
          this.stop();
          reject(err);
        });
      };
      img.onerror = () => {
        // TODO: Error message of image loading
        this.stop();
        reject(genErr(ERR.DEFAULT));
      };
      img.src = source;
    });
  }

  stop() {
    clearInterval(this.timer);
    this.isConverting = false;
    this.timer = null;
  }
}
