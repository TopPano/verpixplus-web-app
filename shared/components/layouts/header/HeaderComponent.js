'use strict';

import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Brand from './BrandComponent.js';
import List from './ListComponent.js';

if (process.env.BROWSER) {
  require('styles/layout/header/Header.css');
}

class HeaderComponent extends React.Component {
  render() {
    return (
      <div className="header-component navbar-fixed-top">
        <Grid fluid>
          <Row>
            <Col xs={4} xsOffset={4}>
              <Brand />
            </Col>
            <Col xs={4}>
              <List username={this.props.username}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

HeaderComponent.displayName = 'LayoutHeaderHeaderComponent';

// Uncomment properties you need
// HeaderComponent.propTypes = {};
// HeaderComponent.defaultProps = {};

export default HeaderComponent;