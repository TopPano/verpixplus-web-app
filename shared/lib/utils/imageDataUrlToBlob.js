import blobUtil from 'blob-util';

export default function imageDataUrlToBlob(imgDataUrl) {
  // Prefix of image data url
  const PREFIX = 'data:image/jpeg;base64,';

  return blobUtil.base64StringToBlob(imgDataUrl.slice(PREFIX.length), 'image/jpeg');
}
