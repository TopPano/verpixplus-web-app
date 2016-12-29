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
      let ratio;
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

        // Save image to local storage
        imagesStorage.save(storageId, 0, source, true).then(() => {
          this.stop();
          execute(handleProgress, 1);
          resolve({
            data: [source],
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
      img.src = source.preview;
    });
  }

  stop() {
    clearInterval(this.timer);
    this.isConverting = false;
    this.timer = null;
  }
}
