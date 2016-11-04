import merge from 'lodash/merge';

import clientConfig from 'etc/client';
import externalApiConfig from 'etc/external-api';

import SITE_CONTENT from 'content/site/en-us.json';
import EMBED_CONTENT from 'content/embed/en-us.json';
import {
  MEDIA_TYPE,
  ORIENTATION,
  SHARE_IMAGE_SIZE
} from 'constants/common';
import { SITE_SHARE_IMAGE } from 'constants/site';

export default function genShareContent(req, isEmbedPage, media) {
  let shareContent = {
    image: `${clientConfig.staticUrl}${SITE_SHARE_IMAGE}`,
    imageWidth: SHARE_IMAGE_SIZE.LANDSCAPE.WIDTH,
    imageHeight: SHARE_IMAGE_SIZE.LANDSCAPE.HEIGHT,
    title: SITE_CONTENT.SHARE.DEFAULT_TITLE,
    description: SITE_CONTENT.SHARE.DEFAULT_DESCRIPTION,
    url: `${req.protocol}://${req.get('Host')}${req.url}`,
    robots: process.NODE_ENV === 'production' ? 'index,follow' : 'noindex,nofollow',
    siteName: SITE_CONTENT.SITE_NAME,
    facebook: {
      id: externalApiConfig.facebook.id,
    }
  }

  if(isEmbedPage) {
    const {
      sid,
      type,
      title,
      caption,
      dimension,
      content
    } = media;
    const isLivephoto = (type === MEDIA_TYPE.LIVE_PHOTO);
    const defaultEmbedContent =
      isLivephoto ?
      EMBED_CONTENT.SHARE.LIVE_PHOTO :
      EMBED_CONTENT.SHARE.PANO_PHOTO;
    const imageSize =
      isLivephoto && dimension.orientation === ORIENTATION.PORTRAIT ?
      SHARE_IMAGE_SIZE.PORTRAIT :
      SHARE_IMAGE_SIZE.LANDSCAPE;
    const newImage = `${content.cdnUrl}${content.shardingKey}/media/${sid}/live/thumb.jpg`;
    const newTitle = title;
    const newDescription = caption;
    const video = `${content.cdnUrl}${content.shardingKey}/media/${sid}/live/video.mp4`;
    const sdk = `${externalApiConfig.sdk.url}/sdk-${isLivephoto ? 'livephoto' : 'panorama'}.js`;

    shareContent = merge({}, shareContent, {
      mediaId: sid,
      image: newImage ? newImage : shareContent.image,
      imageWidth: imageSize.WIDTH,
      imageHeight: imageSize.HEIGHT,
      title: newTitle ? newTitle : defaultEmbedContent.DEFAULT_TITLE,
      description: newDescription ? newDescription : defaultEmbedContent.DEFAULT_DESCRIPTION,
      video,
      sdk
    });
  }

  return shareContent;
}
