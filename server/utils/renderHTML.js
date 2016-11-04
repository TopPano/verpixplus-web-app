import externalApiConfig from 'etc/external-api';

import SITE_CONTENT from 'content/site/en-us.json';

export default function renderHTML(html, initialState, config, shareContent, env) {
  const isProduction = (env === 'production');
  const robotsMeta = isProduction ? 'index,follow' : 'noindex,nofollow';
  const gaSrcUrl = isProduction ? 'https://www.google-analytics.com/analytics.js' : 'https://www.google-analytics.com/analytics_debug.js';
  const vendorScript = isProduction ? `<script type="text/javascript" src="/static/build/vendor.bundle.js"></script>` : '';
  const livephotoSdkUrl = `${externalApiConfig.sdk.url}/sdk-livephoto.js`;

  return `
    <!doctype html>
    <!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
    <!--[if IE 9]> <html lang="en" class="ie9"> <![endif]-->
    <!--[if !IE]><!--> <html lang="en"> <!--<![endif]-->
    <html>
    <head>
      <meta charset="utf8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta name="description" content="${SITE_CONTENT.SHARE.DEFAULT_DESCRIPTION}">
      <meta name="robots" content="${robotsMeta}">
      <meta property="fb:app_id" content="${externalApiConfig.facebook.id}">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="${SITE_CONTENT.SITE_NAME}">
      <meta property="og:image" content="${shareContent.image}">
      <meta property="og:image:width" content="${shareContent.imageWidth}">
      <meta property="og:image:height" content="${shareContent.imageHeight}">
      <meta property="og:title" content="${shareContent.title}">
      <meta property="og:description" content="${shareContent.description}">
      <meta property="og:url" content="${shareContent.url}">
      <title>${SITE_CONTENT.SITE_NAME}</title>
      <link rel="shortcut icon" type="image/png" href="/static/images/favicon.png">
      <link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Open+Sans:400,300,600&amp;subset=cyrillic,latin'>
      <link rel="stylesheet" href="/static/plugins/bootstrap/css/bootstrap.min.css">
      <link rel="stylesheet" href="/static/plugins/unify/css/unify.min.css">
      <link rel="stylesheet" href="/static/plugins/animate.min.css">
      <link rel="stylesheet" href="/static/plugins/line-icons/line-icons.min.css">
      <link rel="stylesheet" href="/static/plugins/font-awesome/css/font-awesome.min.css">
      <link rel="stylesheet" href="/static/build/app.css">
    </head>
    <body>
      <div id="app" class="wrapper page-option-v1">${html}</div>
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script',"${gaSrcUrl}",'ga');
      </script>
      <script>
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
      </script>
      <script>
        !function(e,t,r){function n(){for(;d[0]&&"loaded"==d[0][f];)c=d.shift(),c[o]=!i.parentNode.insertBefore(c,i)}for(var s,a,c,d=[],i=e.scripts[0],o="onreadystatechange",f="readyState";s=r.shift();)a=e.createElement(t),"async"in i?(a.async=!1,e.head.appendChild(a)):i[f]?(d.push(a),a[o]=n):e.write("<"+t+' src="'+s+'" defer></'+t+">"),a.src=s}(document,"script",["${livephotoSdkUrl}"])
      </script>
      <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
      <script>__REACT_DEVTOOLS_GLOBAL_HOOK__ = parent.__REACT_DEVTOOLS_GLOBAL_HOOK__</script>
      <script type="text/javascript" src="/static/plugins/glfx/glfx.js"></script>
      ${vendorScript}
      <script type="text/javascript" src="/static/build/app.js"></script>
    </body>
    </html>
  `;
}
