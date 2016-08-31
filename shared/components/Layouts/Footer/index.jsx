'use strict';

import React from 'react';

import SITE_CONTENT from 'content/site/en-us.json';
import { EXTERNAL_LINKS } from 'constants/common';

if (process.env.BROWSER) {
  require('./Footer.css');
}

class Footer extends React.Component {
  render() {
    return (
      <div className="footer-component footer-v1">
        <div className="copyright">
          <div className="container">
            <div className="col-md-6">
              <p>
                &copy; 2016 Toppano. All Rights Reserved. <a href={EXTERNAL_LINKS.PRIVACY_POLICY} target="_blank">{SITE_CONTENT.FOOTER.PRIVACY_POLICY}</a> | <a href={EXTERNAL_LINKS.TERMS_OF_USE} target="_blank">{SITE_CONTENT.FOOTER.TERMS_OF_USE}</a>
              </p>
            </div>
            <div className="col-md-6">
              <ul className="footer-socials list-inline">
                <li>
                  <a href={EXTERNAL_LINKS.FACEBOOK} target="_blank">
                    <i className="fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href={EXTERNAL_LINKS.TWITTER} target="_blank">
                    <i className="fa fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href={EXTERNAL_LINKS.INSTAGRAM} target="_blank">
                    <i className="fa fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
