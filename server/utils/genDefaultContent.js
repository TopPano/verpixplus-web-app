import merge from 'lodash/merge';

export default function genDefaultContent(html, initialState, shareContent, env) {
  const isProduction = (env === 'production');
  const gaSrcUrl = isProduction ? 'https://www.google-analytics.com/analytics.js' : 'https://www.google-analytics.com/analytics_debug.js';
  const gaSdk =
    '<script>' +
    `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){` +
    `(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),` +
    `m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)` +
    `})(window,document,'script',"${gaSrcUrl}",'ga');` +
    '</script>';
  const vendorScript = isProduction ? `<script type="text/javascript" src="/static/build/vendor.bundle.js"></script>` : '';

  return merge({}, shareContent, {
    html,
    gaSdk,
    initialState,
    vendorScript
  });
}
