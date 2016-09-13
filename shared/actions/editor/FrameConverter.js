import { Promise, execute } from 'lib/utils';

export default class FrameConverter {
  constructor() {
    this.isConverting = false;
  }

  convert(source, handleProgress) {
    return new Promise((resolve, reject) => {
      if (!source) {
        reject('Source is not defined');
      }
      const video = document.createElement('VIDEO');

      video.setAttribute('src', source);
      video.setAttribute('muted', true);
      video.addEventListener('loadedmetadata', () => {
        this.srcVideo = video;
        this.videoCurTime = 0;
        this.frames = [];
        this.progress = 0;
        this.hiddenCan = document.createElement('CANVAS');
        this.hiddenCan.setAttribute('width', this.srcVideo.videoWidth);
        this.hiddenCan.setAttribute('height', this.srcVideo.videoHeight);
        this.hiddenCanCtx = this.hiddenCan.getContext('2d');
        this.srcVideo.addEventListener('play', () => {
          if (!this.isConverting) {
            this.isConverting = true;
            this.videoCurTime = this.srcVideo.currentTime;
            this.captureFrame(handleProgress, (frames) => {
              resolve(frames);
            });
          }
        }, false);
        this.srcVideo.playbackRate = 0.5;
        this.srcVideo.play();
      });
    });
  }

  captureFrame(handleProgress, handleComplete) {
    if (this.srcVideo.ended) {
      this.isConverting = false;
      execute(handleComplete, this.frames);
      return;
    }

    if (this.srcVideo.paused) {
      return;
    }

    if (this.videoCurTime !== this.srcVideo.currentTime) {
      this.videoCurTime = this.srcVideo.currentTime;
      this.hiddenCanCtx.drawImage(this.srcVideo, 0, 0,
                                  this.srcVideo.videoWidth,
                                  this.srcVideo.videoHeight);
      const curFrame = this.hiddenCanCtx.getImageData(0, 0,
                                  this.srcVideo.videoWidth,
                                  this.srcVideo.videoHeight);

      if (this.frames.length === 0 ||
          this.diffFrame(this.frames[this.frames.length - 1], curFrame)) {
        const progress = this.videoCurTime / this.srcVideo.duration;

        this.frames.push(curFrame);
        execute(handleProgress, progress);
      }
    }

    setTimeout(() => {
      this.captureFrame(handleProgress, handleComplete);
    }, 0);
  }

  diffFrame(a, b) {
    const al = a.data.length;
    const bl = b.data.length;
    if (al !== bl) { return true; }
    let isDiff = false;
    for (let i = 0; i < al; i += 4) {
      if ((a.data[i + 0] - b.data[i + 0]) !== 0 ||
          (a.data[i + 1] - b.data[i + 1]) !== 0 ||
          (a.data[i + 2] - b.data[i + 2]) !== 0 ||
          (a.data[i + 3] - b.data[i + 3]) !== 0) {
        isDiff = true;
        break;
      }
    }
    return isDiff;
  }
}
