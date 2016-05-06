'use strict';

import React, { Component, PropTypes } from 'react';

import Summary from './Summary.jsx';
import Gallery from './Gallery.jsx';

if (process.env.BROWSER) {
  require('styles/personal/Personal.css');
}

export default class Personal extends Component {
  static propTyes = {
    person: PropTypes.object.isRequired
  };

  render() {
    const { person } = this.props;
    return (
      <div className="personal-component">
        <Summary person={person} />
        <Gallery
          posts={person.posts.feedPosts}
          postIds={person.posts.feedIds}
          maxWidth={500}
          ratio={2}
        />
      </div>
    );
  }
}

Personal.displayName = 'Personal';
