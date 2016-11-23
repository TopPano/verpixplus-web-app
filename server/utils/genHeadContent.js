import merge from 'lodash/merge';

import clientConfig from 'etc/client';
import externalApiConfig from 'etc/external-api';

import { EMBED } from 'constants/common';
import {
  MEDIA_TYPE,
  ORIENTATION,
  SHARE_IMAGE_SIZE
} from 'constants/common';
import { SITE_SHARE_IMAGE } from 'constants/site';

export default function genHeadContent(req, i18n, isEmbedPage, media) {
  const { l } = i18n;
  let shareContent = {
    image: `${clientConfig.staticUrl}${SITE_SHARE_IMAGE}`,
    imageWidth: SHARE_IMAGE_SIZE.LANDSCAPE.WIDTH,
    imageHeight: SHARE_IMAGE_SIZE.LANDSCAPE.HEIGHT,
    title: 'Verpix',
    description: l('Turn Your World, Turn Your Idea'),
    url: `${req.protocol}://${req.get('Host')}${req.url}`,
    robots: process.NODE_ENV === 'production' ? 'index,follow' : 'noindex,nofollow',
    siteName: 'Verpix',
    livephotoSdk: EMBED.SDK_LIVEPHOTO,
    facebook: {
      id: externalApiConfig.facebook.id,
    }
  }

  if(isEmbedPage) {
    const {
      sid,
      type,
      title,
      dimension,
      caption,
      content
    } = media;
    const isLivephoto = (type === MEDIA_TYPE.LIVE_PHOTO);
    const imageSize =
      isLivephoto && dimension.orientation === ORIENTATION.PORTRAIT ?
      SHARE_IMAGE_SIZE.PORTRAIT :
      SHARE_IMAGE_SIZE.LANDSCAPE;
    const newImage = `${content.cdnUrl}${content.shardingKey}/media/${sid}/live/thumb.jpg`;
    const newTitle = title;
    const video = `${content.cdnUrl}${content.shardingKey}/media/${sid}/live/video.mp4`;

    shareContent = merge({}, shareContent, {
      mediaId: sid,
      image: newImage ? newImage : shareContent.image,
      imageWidth: imageSize.WIDTH,
      imageHeight: imageSize.HEIGHT,
      title: title ? title : shareContent.title,
      description: caption ? caption : shareContent.description,
      video
    });
  }

  return shareContent;
}
