import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import merge from 'lodash/merge';

import genHeadContent from './genHeadContent';
import clientConfig from 'etc/client'
import externalApiConfig from 'etc/external-api'
import {
  SUPPORTED_LOCALES,
  LOCALES_MAPPING,
  GA_SDK
} from 'constants/common';

export default function genStaticPages (page, i18nToolsRegistry, env) {
  let filename;
  let title;

  if (page === '/home') {
    filename = path.join(__dirname, '/../../views/pages/home.ejs');
    title = 'Verpix';
  } else if (page === '/terms') {
    filename = path.join(__dirname, '/../../views/pages/doc.ejs');
    title = 'Terms of Use';
  } else if (page === '/privacy') {
    filename = path.join(__dirname, '/../../views/pages/doc.ejs');
    title = 'Privacy Policy';
  } else {
    return {};
  }

  const template = fs.readFileSync(filename, 'utf-8');

  return SUPPORTED_LOCALES.reduce((pre, locale) => {
    const i18n = i18nToolsRegistry[locale];
    const { l } = i18n;
    const headContent = genHeadContent(clientConfig.staticUrl, i18n, false);
    const content = merge({}, headContent, {
      filename,
      locale,
      localesMapping: LOCALES_MAPPING,
      title: l(title),
      page,
      l,
      cdnUrl: clientConfig.cdnUrl,
      ga: {
        active: env === 'production',
        sdk: GA_SDK,
        trackingCode: externalApiConfig.ga.trackingCode
      }
    });
    const html = ejs.render(template, content);

    return merge({}, pre, {
      [locale]: html
    });
  }, {});
}
