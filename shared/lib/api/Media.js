import Base from './Base';

import { MEDIA_TYPE } from 'constants/common';

export default class MediaAPI extends Base {
  getMedia(mediaId) {
    return this.apiClient.get({
      url: `media/${mediaId}`
    });
  }

  postMedia(mediaType, media, authToken) {
    if (authToken) {
      this.apiClient.setAuthToken(authToken);
    }

    if (mediaType === MEDIA_TYPE.LIVE_PHOTO) {
      return this.apiClient.post({
        url: 'media/livephoto',
        payload: media,
        authenticated: true,
        contentType: 'multipart/form-data'
      });
    } else if (mediaType === MEDIA_TYPE.PANO_PHOTO) {
      // TODO: Handle panophoto
    } else {
      // TODO: Error handling for other cases
      return null;
    }
  }
}
