/* eslint-disable quotes */
export const MODE = {
  WAIT_FILE: 'WAIT_FILE',
  CREATE: 'CREATE',
  EDIT: 'EDIT'
};

export const ACCEPT_TYPES = {
  IMAGE: ['jpeg'],
  VIDEO: ['mp4', 'webm']
};

export const EMBED = {
  SDK:
  '<script>' +
  `!function(e,t,r){function n(){for(;d[0]&&"loaded"==d[0][f];)c=d.shift(),c[o]=!i.parentNode.insertBefore(c,i)}for(var s,a,c,d=[],i=e.scripts[0],o="onreadystatechange",f="readyState";s=r.shift();)a=e.createElement(t),"async"in i?(a.async=!1,e.head.appendChild(a)):i[f]?(d.push(a),a[o]=n):e.write("<"+t+' src="'+s+'" defer></'+t+">"),a.src=s}(document,"script",["http://developer.verpixplus.me/sdk.js"])` +
  '</script>',
  DEFAULT_WIDTH: 480,
  DEFAULT_HEIGHT: 640
};

export const FRAME = {
  LIMIT: 100
};
