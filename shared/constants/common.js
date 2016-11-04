import externalApiConfig from 'etc/external-api';

export const DEFAULT_PROFILE_PHOTO_URL = '/static/images/profile-photo-default.png';

export const DEFAULT_FOLLOWING_USER = 'ddc23b40-222f-11e6-b846-69babe89ef41'

export const DEFAULT_TITLE = 'Untitled';

export const EXTERNAL_LINKS = {
  FAQ: 'https://www.facebook.com/verpix/notes',
  TERMS_OF_USE: 'http://toppano.in/termofuse/',
  PRIVACY_POLICY: 'http://toppano.in/privacy-policy/',
  FACEBOOK: 'https://www.facebook.com/verpix/',
  TWITTER: 'https://twitter.com/verpix',
  INSTAGRAM: 'https://www.instagram.com/verpix_me/'
}

export const MEDIA_TYPE = {
  PANO_PHOTO: 'panoPhoto',
  LIVE_PHOTO: 'livePhoto'
}

export const ORIENTATION = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape'
}

export const DIRECTION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
}

export const SHARE_IMAGE_SIZE = {
  PORTRAIT: {
    WIDTH: 300,
    HEIGHT: 450
  },
  LANDSCAPE: {
    WIDTH: 600,
    HEIGHT: 315
  }
}

export const PROFILE_PICTURE_SIZE =  150;

export const EMBED = {
  SDK_LIVEPHOTO:
  '<script>' +
  `!function(e,t,r){function n(){for(;d[0]&&"loaded"==d[0][f];)c=d.shift(),c[o]=!i.parentNode.insertBefore(c,i)}for(var s,a,c,d=[],i=e.scripts[0],o="onreadystatechange",f="readyState";s=r.shift();)a=e.createElement(t),"async"in i?(a.async=!1,e.head.appendChild(a)):i[f]?(d.push(a),a[o]=n):e.write("<"+t+' src="'+s+'" defer></'+t+">"),a.src=s}(document,"script",["${externalApiConfig.sdk.url}/sdk-livephoto.js"])` +
  '</script>',
  DEFAULT_WIDTH: 480,
  DEFAULT_HEIGHT: 640
};
