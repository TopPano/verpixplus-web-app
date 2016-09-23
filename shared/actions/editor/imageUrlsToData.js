import { Promise } from 'lib/utils';

export default function imageUrlsToData(imgUrls, dimension) {
  const { width, height } = dimension;

  return new Promise((resolve, reject) => {
    const imgsData = [];

    imgUrls.forEach((imgUrl, idx) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('CANVAS');
        const canvasCtx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;
        canvasCtx.drawImage(img, 0, 0);
        imgsData[idx] = canvasCtx.getImageData(0, 0, width, height);
        
        if (imgsData.length === imgUrls.length) {
          resolve(imgsData);
        }
      };
      img.onerror = (e) => {
        reject(e);
      }
      // TODO: set cross origin header in the future
      img.crossOrigin = 'Anonymous';
      img.src = imgUrl;
    });
  });
}
