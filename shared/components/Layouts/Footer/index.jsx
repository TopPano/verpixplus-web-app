'use strict';

import React from 'react';

if (process.env.BROWSER) {
  require('./Footer.css');
}

class Footer extends React.Component {
  render() {
    return (
      <div className="footer-component container-center-row">
        <p>&copy; 2016 Toppano. All Rights Reserved.</p>
      </div>
    );
  }
}

export default Footer;
