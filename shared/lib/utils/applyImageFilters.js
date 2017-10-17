import {
  imagesStorage,
  Promise
} from 'lib/utils';

let canvasGL;
let texture;

// FIXME:
// glfx does not support server-side rendering,
// please use another elegant method to solve this problem.
if (process.env.BROWSER) {
  canvasGL = fx.canvas();
  texture = canvasGL.texture(new Image());
}

export default function applyImageFilters(storageId, idx, filters, returnType = 'webgl') {
  return new Promise((resolve, reject) => {
    if (returnType !== 'webgl' && returnType !== 'image') {
      reject(new Error(`Non-supported returnType : ${returnType}`));
    }
    imagesStorage.load(storageId, idx).then((imgSrc) => {
      const img = new Image;

      img.onload = function() {
        const { adjusts } = filters;
        const {
          brightness,
          contrast,
          hue,
          saturation,
          vibrance,
          sepia,
          vignette
        } = adjusts;

        texture.loadContentsOf(img);
        canvasGL.draw(texture);
        if (brightness && contrast) {
          canvasGL.brightnessContrast(brightness, contrast);
        }
        if (brightness) {
          canvasGL.brightnessContrast(brightness, 0);
        }
        if (contrast) {
          canvasGL.brightnessContrast(0, contrast);
        }
        if (hue && saturation) {
          canvasGL.hueSaturation(hue, saturation);
        }
        if (hue) {
          canvasGL.hueSaturation(hue, 0);
        }
        if (saturation) {
          canvasGL.hueSaturation(0, saturation);
        }
        if (vibrance) {
          canvasGL.vibrance(vibrance);
        }
        if (sepia) {
          canvasGL.sepia(sepia);
        }
        if (vignette) {
          // TODO:
          // Only support modifying amount now,
          // please also support modifying size (first argument) in the future
          canvasGL.vignette(0.5, vignette);
        }
        canvasGL.update();

        if (returnType === 'webgl') {
          resolve(canvasGL);
        } else if (returnType === 'image') {
          const appliedImg = new Image();

          appliedImg.onload = () => {
            resolve(appliedImg);
          };
          appliedImg.onerror = (err) => {
            reject(err);
          };
          appliedImg.src = canvasGL.toDataURL('image/jpeg');
        }
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = imgSrc;
    }).catch((err) => {
      reject(err);
    });
  });
}
