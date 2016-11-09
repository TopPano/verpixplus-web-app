import { FPS } from 'constants/editor';
import {
  Promise,
  imagesStorage,
  execute
} from 'lib/utils';

const SEEK_TIME_STEP = 1 / FPS;

export default class FrameConverter {
  constructor() {
    this.isConverting = false;
  }

  convert(storageId, source, handleProgress) {
    return new Promise((resolve, reject) => {
      if (!source) {
        reject('Source is not defined');
      }
      const video = document.createElement('VIDEO');

      video.setAttribute('src', source);
      video.setAttribute('muted', true);
      video.addEventListener('loadedmetadata', () => {
        this.srcVideo = video;
        this.srcVideo.currentTime = 0;
        this.frames = [];
        this.progress = 0;
        this.hiddenCan = document.createElement('CANVAS');
        this.hiddenCan.setAttribute('width', this.srcVideo.videoWidth);
        this.hiddenCan.setAttribute('height', this.srcVideo.videoHeight);
        this.hiddenCanCtx = this.hiddenCan.getContext('2d');
        this.srcVideo.addEventListener('seeked', () => {
          this.captureFrame(storageId, handleProgress, (result) => {
            resolve(result);
          }, (err) => {
            reject(err);
          });
        });
        this.srcVideo.currentTime = 0;
      });
    });
  }

  captureFrame(storageId, handleProgress, handleComplete, handleFailure) {
    this.hiddenCanCtx.drawImage(this.srcVideo, 0, 0,
                                this.srcVideo.videoWidth,
                                this.srcVideo.videoHeight);

    const curFrameDataUrl = this.hiddenCan.toDataURL('image/jpeg');
    const idx = this.frames.length;

    imagesStorage.save(storageId, idx, curFrameDataUrl).then(() => {
      const img = new Image();
      img.onload = () => {
        const progress = this.srcVideo.currentTime / this.srcVideo.duration;
        const curFrame = img;

        this.frames.push(curFrame);
        execute(handleProgress, progress);

        if (this.srcVideo.currentTime < this.srcVideo.duration) {
          this.srcVideo.currentTime += SEEK_TIME_STEP;
        } else {
          execute(handleComplete, {
            data: this.frames,
            dimension: {
              width: this.srcVideo.videoWidth,
              height: this.srcVideo.videoHeight
            }
          });
        }
      };
      img.onerror = (err) => {
        handleFailure(err);
      }
      img.src = curFrameDataUrl;
    }).catch((err) => {
      handleFailure(err);
    });
  }
}
