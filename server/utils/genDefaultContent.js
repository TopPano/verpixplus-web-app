import merge from 'lodash/merge';

import { GA_SDK } from 'constants/common';

export default function genDefaultContent(html, initialState, shareContent, env) {
  const isProduction = (env === 'production');
  const vendorScript = isProduction ? `<script type="text/javascript" src="/static/build/vendor.bundle.js"></script>` : '';

  return merge({}, shareContent, {
    html,
    gaSdk: GA_SDK,
    initialState,
    vendorScript
  });
}
