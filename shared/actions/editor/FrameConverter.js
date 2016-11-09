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
    this.eventListeners = [];
  }

  registerEventListener(video, event, callback) {
    if (!video.eventListeners) {
      video.eventListeners = [];
    }
    video.eventListeners.push({
      event,
      callback
    });
    video.addEventListener(event, callback);
  }

  unregisterAllEventListenrs(video) {
    if (video.eventListeners) {
      video.eventListeners.forEach((eventListener) => {
        video.removeEventListener(eventListener.event, eventListener.callback);
      });
    }
  }

  convert(storageId, source, handleProgress) {
    return new Promise((resolve, reject) => {
      if (!source) {
        reject('Source is not defined');
      }
      if (this.isConverting) {
        reject('FrameConverter is converting');
      }
      const video = document.createElement('VIDEO');

      video.setAttribute('src', source);
      video.setAttribute('muted', true);
      this.registerEventListener(video, 'loadedmetadata', () => {
        this.isConverting = true;
        this.srcVideo = video;
        this.srcVideo.currentTime = 0;
        this.frames = [];
        this.progress = 0;
        this.hiddenCan = document.createElement('CANVAS');
        this.hiddenCan.setAttribute('width', this.srcVideo.videoWidth);
        this.hiddenCan.setAttribute('height', this.srcVideo.videoHeight);
        this.hiddenCanCtx = this.hiddenCan.getContext('2d');
        this.registerEventListener(video, 'seeked', () => {
          this.captureFrame(storageId, (progress) => {
            if (this.isConverting) {
              handleProgress(progress);
            }
          }, (result) => {
            if (this.isConverting) {
              this.isConverting = false;
              resolve(result);
            }
          }, (err) => {
            if (this.isConverting) {
              this.isConverting = false;
              reject(err);
            }
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

  stop() {
    this.unregisterAllEventListenrs(this.srcVideo);
    this.isConverting = false;
    this.srcVideo = null;
    this.frames = null;
    this.progress = 0;
    this.hiddenCan = null;
    this.hiddenCanCtx = null;
  }
}
